import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function CourseCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [contentFiles, setContentFiles] = useState([]);
  const [contentPreviews, setContentPreviews] = useState([]);

  const navigate = useNavigate();

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
    const newPreviews = files.map(file => ({
      name: file.name,
      type: file.type.startsWith('video/') ? 'video' : 'pdf',
      preview: file.type.startsWith('video/') ? URL.createObjectURL(file) : null
    }));
    
    setContentFiles(prev => [...prev, ...files]);
    setContentPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);
    
    // Append content files
    contentFiles.forEach((file, index) => {
      formData.append("content", file);
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
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.errors || "Error creating course");
    }
  };

  return (
    <div>
      <div className="min-h-screen py-10">
        <div className="max-w-4xl mx-auto p-6 border rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-8">Create Course</h3>

          <form onSubmit={handleCreateCourse} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-lg">Title</label>
              <input
                type="text"
                placeholder="Enter your course title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Description</label>
              <textarea
                placeholder="Enter your course description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
                rows="4"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Price</label>
              <input
                type="number"
                placeholder="Enter your course price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Course Image</label>
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
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Course Content (Videos and PDFs)</label>
              <input
                type="file"
                accept="video/*,.pdf"
                multiple
                onChange={handleContentUpload}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
              
              {contentPreviews.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">Uploaded Files:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contentPreviews.map((preview, index) => (
                      <div key={index} className="border p-3 rounded-md">
                        <p className="font-medium">{preview.name}</p>
                        <p className="text-sm text-gray-500">Type: {preview.type}</p>
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
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
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
