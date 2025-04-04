import React, { useEffect, useState } from "react";
import logo from "../../public/logo.webp";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";

function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status
  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

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
    <div className="bg-gradient-to-r from-black to-blue-950">
      <div className="h-[1250px] md:h-[1050px] text-white container mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="logo" className="w-7 h-7 md:w-10 md:h-10 rounded-full" />
            <h1 className="md:text-2xl text-orange-500 font-bold">CourseHaven</h1>
          </div>
          <div className="space-x-4">
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
          <h1 className="text-4xl font-semibold text-orange-500">CourseHaven</h1>
          <p className="text-gray-500 mt-4">Sharpen your skills with courses crafted by experts.</p>
          <div className="space-x-4 mt-8">
            <Link to="/courses" className="bg-green-500 text-white py-3 px-6 rounded font-semibold hover:bg-white hover:text-black duration-300">
              Explore courses
            </Link>
            <a
              href="https://www.youtube.com/learncodingofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black py-3 px-6 rounded font-semibold hover:bg-green-500 hover:text-white duration-300"
            >
              Course videos
            </a>
          </div>
        </section>

        {/* Courses Carousel */}
        <section className="p-10">
          {courses.length > 0 ? (
            <Slider {...sliderSettings}>
              {courses.map((course) => (
                <div key={course._id} className="p-4">
                  <div className="bg-gray-900 rounded-lg overflow-hidden transition-transform duration-300 transform hover:scale-105">
                    <img src={course.image?.url} alt={course.title} className="h-32 w-full object-contain" />
                    <div className="p-6 text-center">
                      <h2 className="text-xl font-bold">{course.title}</h2>
                      <Link
                        to={`/buy/${course._id}`}
                        className="mt-4 inline-block bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-blue-500 duration-300"
                      >
                        Enroll Now
                      </Link>
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
        <footer className="my-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <img src={logo} alt="logo" className="w-10 h-10 rounded-full" />
                <h1 className="text-2xl text-orange-500 font-bold">CourseHaven</h1>
              </div>
              <p className="mt-3 text-gray-400">Follow us</p>
              <div className="flex justify-center md:justify-start space-x-4 mt-2">
                <a href="#"><FaFacebook className="text-2xl hover:text-blue-400 duration-300" /></a>
                <a href="#"><FaInstagram className="text-2xl hover:text-pink-600 duration-300" /></a>
                <a href="#"><FaTwitter className="text-2xl hover:text-blue-600 duration-300" /></a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">YouTube - Learn Coding</li>
                <li className="hover:text-white cursor-pointer">Telegram - Learn Coding</li>
                <li className="hover:text-white cursor-pointer">GitHub - Learn Coding</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">© 2024</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
                <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer">Refund & Cancellation</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
