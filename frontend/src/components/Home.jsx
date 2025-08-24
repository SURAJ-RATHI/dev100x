import React, { useEffect, useState } from "react";
import logo from "../../public/logo.webp";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaSun, FaMoon } from "react-icons/fa";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";

function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Check login status
  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
    
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
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });

        const fetchedCourses = response.data?.courses || [];
        setCourses(fetchedCourses);
      } catch (error) {
        console.error("Error fetching courses: ", error);
        setCourses([]); // fallback to empty array
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
      console.error("Error during logout: ", error);
      toast.error(error?.response?.data?.errors || "Error in logging out");
    }
  };

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className={`bg-gradient-to-r ${isDarkMode ? 'from-gray-900 to-gray-800' : 'from-black to-blue-950'}`}>
      <div className="h-[1250px] md:h-[1050px] text-white container mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="logo" className="w-7 h-7 md:w-10 md:h-10 rounded-full" />
            <h1 className="md:text-2xl text-blue-400 font-bold">DEV100X</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <FaSun className="text-yellow-400 text-xl" />
              ) : (
                <FaMoon className="text-gray-300 text-xl" />
              )}
            </button>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="border border-white text-white p-2 rounded">Login</Link>
                <Link to="/signup" className="border border-white text-white p-2 rounded">Signup</Link>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center py-20">
          <h1 className="text-4xl font-semibold text-blue-400">DEV100X</h1>
          <p className="text-gray-500 mt-4">Sharpen your skills with courses crafted by experts.</p>
          <div className="space-x-4 mt-8">
            <Link to="/courses" className="bg-blue-400 text-white py-3 px-6 rounded font-semibold hover:bg-white hover:text-black duration-300">
              Explore courses
            </Link>
            <Link
              to="/purchases"
              className="bg-white text-black py-3 px-6 rounded font-semibold hover:bg-blue-400 hover:text-white duration-300"
            >
              View Purchases
            </Link>
          </div>
        </section>

        {/* Courses Carousel */}
        <section className="p-10">
          {courses.length > 0 ? (
            <Slider {...sliderSettings}>
              {courses.map((course) => (
                <div key={course._id} className="p-4">
                  <div className={`group relative overflow-hidden rounded-2xl ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  } shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2`}>
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={course.image?.url} 
                        alt={course.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <h2 className={`font-bold text-xl leading-tight line-clamp-2 group-hover:text-blue-400 transition-colors duration-500 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {course.title}
                        </h2>
                        <p className={`text-sm leading-relaxed line-clamp-2 transition-colors duration-500 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {course.description}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-lg font-bold text-blue-400">
                            ${course.price}
                          </span>
                          <Link
                            to={`/buy/${course._id}`}
                            className="bg-gradient-to-r from-blue-400 to-blue-500 text-white py-2 px-6 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-500 transform hover:scale-[1.02] shadow-lg hover:shadow-blue-500/20"
                          >
                            Enroll Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <p className="text-center text-gray-400">No courses available right now.</p>
          )}
        </section>

        <hr />

        {/* Footer */}
        <footer className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {/* Brand Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <img src={logo} alt="logo" className="w-12 h-12 rounded-full" />
                  <h1 className="text-2xl font-bold text-blue-500">DEV100X</h1>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Empowering developers with high-quality courses and practical knowledge.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} transition-colors`}>
                    <FaFacebook className="text-blue-500" />
                  </a>
                  <a href="#" className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} transition-colors`}>
                    <FaTwitter className="text-blue-400" />
                  </a>
                  <a href="#" className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} transition-colors`}>
                    <FaInstagram className="text-pink-500" />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quick Links</h3>
                <ul className="space-y-3">
                  <li>
                    <Link to="/courses" className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                      Browse Courses
                    </Link>
                  </li>
                  <li>
                    <Link to="/purchases" className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                      My Purchases
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                      Sign Up
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Contact Us</h3>
                <ul className="space-y-3">
                  <li className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Email: support@dev100x.com
                  </li>
                  <li className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Phone: +91 7015506489
                  </li>
                  <li className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Address: TIT College Bhiwani, Haryana, India
                  </li>
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Newsletter</h3>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Subscribe to our newsletter for the latest updates and course releases.
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={`flex-1 px-4 py-2 rounded-l-lg text-sm focus:outline-none ${
                      isDarkMode 
                        ? 'bg-gray-800 text-white placeholder-gray-400' 
                        : 'bg-white text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <button className={`px-4 py-2 rounded-r-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors`}>
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className={`mt-12 pt-8 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  © 2024 DEV100X. All rights reserved.
                </p>
                <div className="flex space-x-6">
                  <a href="#" className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                    Privacy Policy
                  </a>
                  <a href="#" className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
