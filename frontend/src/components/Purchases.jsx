import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaDiscourse, FaDownload, FaSun, FaMoon } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
import { FiSearch } from "react-icons/fi";

function Purchases() {
  const [purchases, setPurchase] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  if (!token) {
    navigate("/login");
  }

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/user/purchases`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setPurchase(response.data.courseData);
      } catch (error) {
        setErrorMessage("Failed to fetch purchase data");
      }
    };
    fetchPurchases();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      navigate("/login");
      setIsLoggedIn(false);
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const filteredPurchases = purchases.filter((purchase) =>
    purchase.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    purchase.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} p-5 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-50`}
      >
        <div className="flex items-center mb-8">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.webp" alt="Logo" className="h-8 w-8 rounded-full scale-700"  />
            <span className={`text-xl font-bold ${isDarkMode ? 'text-blue-500' : 'text-blue-500'}`}>DEV100X</span>
          </Link>
        </div>
        <nav>
          <ul className="mt-4">
            <li className="mb-4">
              <Link to="/" className={`flex items-center ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/courses" className={`flex items-center ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/purchases" className={`flex items-center text-blue-500 hover:text-blue-600`}>
                <FaDownload className="mr-2" /> Purchases
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/settings" className={`flex items-center ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                <IoMdSettings className="mr-2" /> Settings
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <button onClick={handleLogout} className={`flex items-center ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                  <IoLogOut className="mr-2" /> Logout
                </button>
              ) : (
                <Link to="/login" className={`flex items-center ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-lg"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
      </button>

      {/* Main Content */}
      <div className={`flex-1 p-4 md:p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-all duration-300 ${
        isSidebarOpen ? "ml-64" : "ml-0"
      } md:ml-64`}>
        <div className={`sticky top-0 z-10 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-4 backdrop-blur-sm`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Purchases</h2>
              <div className="relative flex-1 md:min-w-[300px]">
                <input
                  type="text"
                  placeholder="Search your purchases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300`}
                />
                <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
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
        </div>

        {errorMessage && (
          <div className={`text-red-500 text-center my-4 p-4 rounded-lg ${isDarkMode ? 'bg-red-900/20' : 'bg-red-100/80'}`}>
            {errorMessage}
          </div>
        )}

        <div className="mt-6">
          {purchases.length > 0 ? (
            <>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                Showing {filteredPurchases.length} of {purchases.length} purchases
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPurchases.map((purchase) => (
                  <div
                    key={purchase._id}
                    className={`group relative overflow-hidden rounded-2xl ${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    } shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2`}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        src={purchase.image?.url || "https://via.placeholder.com/200"}
                        alt={purchase.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    </div>

                    <div className={`p-6 transition-all duration-500 ${
                      isDarkMode 
                        ? 'group-hover:bg-gradient-to-br group-hover:from-gray-800 group-hover:to-gray-900' 
                        : 'group-hover:bg-gradient-to-br group-hover:from-gray-50 group-hover:to-gray-100'
                    }`}>
                      <div className="space-y-4">
                        <h3 className={`font-bold text-xl leading-tight line-clamp-2 group-hover:text-blue-400 transition-colors duration-500 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {purchase.title}
                        </h3>
                        <p className={`text-sm leading-relaxed line-clamp-2 transition-colors duration-500 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {purchase.description}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-lg font-bold text-blue-400">
                            ${purchase.price}
                          </span>
                          <Link
                            to={`/view-course/${purchase._id}`}
                            className="bg-gradient-to-r from-blue-400 to-blue-500 text-white py-2 px-6 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-500 transform hover:scale-[1.02] shadow-lg hover:shadow-blue-500/20"
                          >
                            View Course
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className={`text-lg mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>You have no purchases yet.</p>
              <Link 
                to="/courses" 
                className="inline-block bg-gradient-to-r from-blue-400 to-blue-500 text-white py-2 px-6 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-300"
              >
                Browse Courses
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Purchases;
