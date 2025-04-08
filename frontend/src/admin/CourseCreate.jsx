import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
import { FaSun, FaMoon, FaTrash } from "react-icons/fa";

function CourseCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [contentFiles, setContentFiles] = useState([]);
  const [contentPreviews, setContentPreviews] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [contentDescriptions, setContentDescriptions] = useState({});

  const navigate = useNavigate();

  // Toggle dark mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Check for saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const handleContentUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file, index) => {
      const defaultTitle = `Lecture ${contentPreviews.length + index + 1}`;
      const fileType = file.type.startsWith('video/') ? 'video' : 'pdf';
      
      // Add default description
      setContentDescriptions(prev => ({
        ...prev,
        [file.name]: {
          title: defaultTitle,
          description: `Description for ${defaultTitle}`
        }
      }));

      return {
        name: file.name,
        type: fileType,
        preview: fileType === 'video' ? URL.createObjectURL(file) : null,
        defaultTitle
      };
    });
    
    setContentFiles(prev => [...prev, ...files]);
    setContentPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveContent = (index) => {
    setContentFiles(prev => prev.filter((_, i) => i !== index));
    setContentPreviews(prev => prev.filter((_, i) => i !== index));
    setContentDescriptions(prev => {
      const newDescriptions = { ...prev };
      delete newDescriptions[contentPreviews[index].name];
      return newDescriptions;
    });
  };

  const handleContentMetadataChange = (fileName, field, value) => {
    setContentDescriptions(prev => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        [field]: value
      }
    }));
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);
    
    // Append content files with their metadata
    contentFiles.forEach((file, index) => {
      formData.append("content", file);
      formData.append("contentMetadata", JSON.stringify({
        fileName: file.name,
        ...contentDescriptions[file.name]
      }));
    });

    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin.token;
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/course/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Course created successfully");
      navigate("/admin/our-courses");
      // Reset form
      setTitle("");
      setPrice("");
      setDescription("");
      setImage(null);
      setImagePreview("");
      setContentFiles([]);
      setContentPreviews([]);
      setContentDescriptions({});
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.errors || "Error creating course");
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/our-courses"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Go to Dashboard
            </Link>
            <h3 className="text-2xl font-semibold">Create Course</h3>
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors duration-300`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <FaSun className="text-yellow-400 text-xl" />
            ) : (
              <FaMoon className="text-gray-600 text-xl" />
            )}
          </button>
        </div>

        <div className={`rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <form onSubmit={handleCreateCourse} className="space-y-6">
            <div className="space-y-2">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title</label>
              <input
                type="text"
                placeholder="Enter your course title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg outline-none transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } border`}
                required
              />
            </div>

            <div className="space-y-2">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
              <textarea
                placeholder="Enter your course description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg outline-none transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } border`}
                rows="4"
                required
              />
            </div>

            <div className="space-y-2">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Price</label>
              <input
                type="number"
                placeholder="Enter your course price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg outline-none transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } border`}
                required
              />
            </div>

            <div className="space-y-2">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Course Image</label>
              <div className="flex items-center justify-center">
                <img
                  src={imagePreview || "/imgPL.webp"}
                  alt="Course"
                  className="w-full max-w-sm h-auto rounded-md object-cover"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={changePhotoHandler}
                className={`w-full px-3 py-2 rounded-md outline-none transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } border`}
                required
              />
            </div>

            <div className="space-y-2">
              <label className={`block text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Course Content (Videos and PDFs)</label>
              <input
                type="file"
                accept="video/*,.pdf"
                multiple
                onChange={handleContentUpload}
                className={`w-full px-3 py-2 rounded-md outline-none transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } border`}
              />
              
              {contentPreviews.length > 0 && (
                <div className="mt-4 space-y-4">
                  <h4 className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Uploaded Files:</h4>
                  <div className="space-y-4">
                    {contentPreviews.map((preview, index) => (
                      <div key={index} className={`border rounded-lg p-4 ${
                        isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
                      }`}>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={contentDescriptions[preview.name]?.title || preview.defaultTitle}
                              onChange={(e) => handleContentMetadataChange(preview.name, 'title', e.target.value)}
                              className={`w-full px-3 py-2 rounded-md mb-2 ${
                                isDarkMode 
                                  ? 'bg-gray-600 text-white' 
                                  : 'bg-white text-gray-900'
                              }`}
                              placeholder="Enter title"
                            />
                            <textarea
                              value={contentDescriptions[preview.name]?.description || ''}
                              onChange={(e) => handleContentMetadataChange(preview.name, 'description', e.target.value)}
                              className={`w-full px-3 py-2 rounded-md ${
                                isDarkMode 
                                  ? 'bg-gray-600 text-white' 
                                  : 'bg-white text-gray-900'
                              }`}
                              placeholder="Enter description"
                              rows="2"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveContent(index)}
                            className="ml-2 p-2 text-red-500 hover:text-red-600"
                          >
                            <FaTrash />
                          </button>
                        </div>
                        <div className="flex items-center">
                          <span className={`text-sm ${preview.type === 'video' ? 'text-blue-500' : 'text-green-500'}`}>
                            {preview.type === 'video' ? 'Video' : 'PDF'}: {preview.name}
                          </span>
                        </div>
                        {preview.type === 'video' && preview.preview && (
                          <video
                            src={preview.preview}
                            controls
                            className="w-full mt-2 rounded-md"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-md transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white font-medium`}
            >
              Create Course
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CourseCreate;
