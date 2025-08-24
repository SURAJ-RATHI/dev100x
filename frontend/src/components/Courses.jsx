import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API call
import { FaCircleUser, FaSun, FaMoon } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi"; // Import menu and close icons
import logo from "../../public/logo.webp";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  console.log("courses: ", courses);

  // Toggle dark mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Check login status and theme preference
  useEffect(() => {
    const token = localStorage.getItem("user");
    setIsLoggedIn(!!token);
    
    // Check for saved theme preference
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

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        console.log("API Response:", response.data);
        if (response.data && response.data.courses) {
          setCourses(response.data.courses);
        } else {
          setError("No courses found");
        }
      } catch (error) {
        console.error("Error in fetchCourses:", error);
        setError(error.response?.data?.errors || "Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };

  // Toggle sidebar for mobile devices
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Filter courses based on search query
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`flex ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Hamburger menu button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 text-3xl"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />} {/* Toggle menu icon */}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} w-64 p-5 transform z-10 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        <div className="flex items-center mb-10 mt-10 md:mt-0">
          <img src={logo} alt="Profile" className="rounded-full h-12 w-12" />
        </div>
        <nav>
          <ul>
            <li className="mb-4">
              <Link to="/" className="flex items-center">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/courses" className="flex items-center text-blue-500">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/purchases" className="flex items-center">
                <FaDownload className="mr-2" /> Purchases
              </Link>
            </li>
            <li className="mb-4">
              <Link to="#" className="flex items-center">
                <IoMdSettings className="mr-2" /> Settings
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <Link to={"/"}
                  className="flex items-center"
                  onClick={handleLogout}
                >
                  <IoLogOut className="mr-2" /> Logout
                </Link>
              ) : (
                <Link to={"/login"} className="flex items-center">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className={`ml-0 md:ml-64 w-full ${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-10`}>
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-xl font-bold">Courses</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <FaSun className="text-yellow-400 text-xl" />
              ) : (
                <FaMoon className="text-gray-600 text-xl" />
              )}
            </button>
            <div className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 pr-4 py-2 ${
                    isDarkMode 
                      ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                  } border rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                />
                <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                } text-xl`} />
              </div>
            </div>

            <FaCircleUser className="text-4xl text-blue-600" />
          </div>
        </header>

        {/* Vertically Scrollable Courses Section */}
        <div className="overflow-y-auto h-[75vh]">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : filteredCourses.length === 0 ? (
            <p className="text-center text-gray-500">
              {searchQuery ? "No courses found matching your search" : "No courses available at the moment"}
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  className={`group relative overflow-hidden rounded-2xl ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  } shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2`}
                >
                  {/* Course Image with Overlay */}
                  <div className="relative h-56 overflow-hidden">
                    {course?.image?.url ? (
                      <img
                        src={course.image.url}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Image Available</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  </div>

                  {/* Course Content */}
                  <div className="p-6 transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-gray-50 group-hover:to-gray-100 dark:group-hover:from-gray-700 dark:group-hover:to-gray-800">
                    <div className="space-y-4">
                      {/* Price Display */}
                      <div className="flex justify-between items-center transform transition-transform duration-500 group-hover:scale-105">
                        <span className="text-2xl font-bold text-blue-400">
                          ₹{course.price}
                        </span>
                        <span className="text-sm text-gray-400">per course</span>
                      </div>

                      <h2 className="font-bold text-xl leading-tight line-clamp-2 group-hover:text-blue-400 transition-colors duration-500">
                        {course.title}
                      </h2>
                      
                      <p className={`text-sm leading-relaxed line-clamp-3 transition-colors duration-500 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {course.description}
                      </p>

                      {/* Creator Info */}
                      <div className="flex items-center space-x-2 transform transition-transform duration-500 group-hover:translate-x-1">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <FaCircleUser className="text-gray-500" />
                        </div>
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {course.creatorId?.username || course.creatorId?.name || 'Admin'}
                        </span>
                      </div>

                      {/* Enroll Button */}
                      <Link
                        to={`/buy/${course._id}`}
                        className="block w-full text-center bg-gradient-to-r from-blue-400 to-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-500 hover:to-blue-600 transition-all duration-500 transform hover:scale-[1.02] shadow-lg hover:shadow-blue-500/20 group-hover:shadow-xl group-hover:shadow-blue-500/30"
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Courses;
