import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Beds from "./pages/Beds";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import VerifyOTP from "./pages/VerifyOTP";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import ResetPassword from "./pages/ResetPassword";
import Assignments from "./pages/Assignments"; 
import Profile from "./pages/Profile";           

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="text-center">
            <Routes>
              <Route path="/" element={<Home />} /> 
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/beds" element={<Beds />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/assignments" element={<Assignments />} /> 
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="*" element={<Home />} /> {/* fallback */}
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </>
  );
}

export default App;
