import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
import { FaArrowLeft, FaVideo, FaFilePdf } from "react-icons/fa";

function ViewCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.token) {
          navigate("/login");
          return;
        }

        // First verify if user has purchased this course
        const purchaseResponse = await axios.get(
          `${BACKEND_URL}/user/purchases`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            withCredentials: true,
          }
        );

        const hasPurchased = purchaseResponse.data.courseData.some(
          (course) => course._id === courseId
        );

        if (!hasPurchased) {
          setError("You need to purchase this course to view its content");
          setLoading(false);
          return;
        }

        // Fetch course details
        const courseResponse = await axios.get(
          `${BACKEND_URL}/course/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            withCredentials: true,
          }
        );

        console.log("Course data:", courseResponse.data.course); // Debug log
        setCourse(courseResponse.data.course);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course:", error);
        setError("Failed to load course content");
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={() => navigate("/courses")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate("/purchases")}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Purchases
        </button>

        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img
                src={course.image.url}
                alt={course.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="md:w-2/3">
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center text-green-600 font-semibold">
                <span>Price: ${course.price}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Course Content</h2>
          {course.content && course.content.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {course.content.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center mb-3">
                    {item.type === "video" ? (
                      <FaVideo className="text-red-500 mr-2" />
                    ) : (
                      <FaFilePdf className="text-red-500 mr-2" />
                    )}
                    <h3 className="font-semibold">{item.title}</h3>
                  </div>
                  {item.type === "video" ? (
                    <video
                      src={item.file.url}
                      controls
                      className="w-full rounded-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        {Math.round(item.file.size / 1024)} KB
                      </span>
                      <a
                        href={item.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View PDF
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg mb-4">No content available for this course yet.</p>
              <p className="text-sm text-gray-400">Please check back later or contact the course instructor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewCourse; 