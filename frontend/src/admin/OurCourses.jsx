import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
import { FaSun, FaMoon } from "react-icons/fa";

function OurCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));
  const token = admin.token;

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

  if (!token) {
    toast.error("Please login to admin");
    navigate("/admin/login");
  }

  // fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        console.log(response.data.courses);
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchCourses();
  }, []);

  // delete courses code
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/course/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      const updatedCourses = courses.filter((course) => course._id !== id);
      setCourses(updatedCourses);
    } catch (error) {
      console.log("Error in deleting course ", error);
      toast.error(error.response.data.errors || "Error in deleting course");
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} p-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Our Courses</h1>
          <div className="flex items-center space-x-4">
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
            <Link
              to="/admin/dashboard"
              className={`py-2 px-4 rounded-md transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              Go to dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className={`group relative overflow-hidden rounded-2xl ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2`}
            >
              {/* Course Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course?.image?.url}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </div>

              {/* Course Content */}
              <div className={`p-6 transition-all duration-500 ${
                isDarkMode 
                  ? 'group-hover:bg-gray-700' 
                  : 'group-hover:bg-gradient-to-br group-hover:from-gray-50 group-hover:to-gray-100'
              }`}>
                <div className="space-y-4">
                  {/* Price Display */}
                  <div className="flex justify-between items-center transform transition-transform duration-500 group-hover:scale-105">
                    <span className="text-2xl font-bold text-blue-400">
                      ₹{course.price}
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      per course
                    </span>
                  </div>

                  {/* Course Title */}
                  <h2 className={`font-bold text-xl leading-tight line-clamp-2 group-hover:text-blue-400 transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {course.title}
                  </h2>

                  {/* Course Description */}
                  <p className={`text-sm leading-relaxed line-clamp-3 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {course.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex justify-between space-x-4">
                    <Link
                      to={`/admin/update-course/${course._id}`}
                      className={`flex-1 text-center py-2 px-4 rounded-xl font-semibold transition-all duration-500 transform hover:scale-[1.02] shadow-lg ${
                        isDarkMode 
                          ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/20' 
                          : 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 hover:shadow-blue-500/20'
                      } text-white`}
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all duration-500 transform hover:scale-[1.02] shadow-lg ${
                        isDarkMode 
                          ? 'bg-red-600 hover:bg-red-700 hover:shadow-red-500/20' 
                          : 'bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 hover:shadow-red-500/20'
                      } text-white`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OurCourses;
