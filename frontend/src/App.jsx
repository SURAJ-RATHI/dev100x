import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Import components
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Purchases from "./components/Purchases";
import Buy from "./components/Buy";
import Courses from "./components/Courses";
import ViewCourse from "./components/ViewCourse";

// Import admin components
import AdminSignup from "./admin/AdminSignup";
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
import CourseCreate from "./admin/CourseCreate";
import UpdateCourse from "./admin/UpdateCourse";
import OurCourses from "./admin/OurCourses";

// Protected Route component
const ProtectedRoute = ({ children, isAdmin = false }) => {
  const user = JSON.parse(localStorage.getItem(isAdmin ? "admin" : "user"));
  return user ? children : <Navigate to={isAdmin ? "/admin/login" : "/login"} />;
};

function App() {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/buy/:courseId" element={<Buy />} />

        {/* Protected User Routes */}
        <Route
          path="/purchases"
          element={
            <ProtectedRoute>
              <Purchases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-course/:courseId"
          element={
            <ProtectedRoute>
              <ViewCourse />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute isAdmin>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-course"
          element={
            <ProtectedRoute isAdmin>
              <CourseCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/update-course/:id"
          element={
            <ProtectedRoute isAdmin>
              <UpdateCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/our-courses"
          element={
            <ProtectedRoute isAdmin>
              <OurCourses />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
