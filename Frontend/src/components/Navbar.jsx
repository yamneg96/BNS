import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bedIcon from "../assets/medical-bed.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
    logout();
  };

  return (
    <nav className="p-4 bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src={bedIcon} alt="Bed Icon" className="h-8" />
          <Link to="/" className="text-xl font-bold font-inter">
            Bed Notification System | BNS
          </Link>
        </div>
        <div className="flex items-center space-x-4 font-medium">
          {user ? (
            <>
              <Link className="text-gray-300 hidden md:block">
                Hello, {user.name} ({user.role})
              </Link>
              {user.role === "admin" && (
                <Link to="/all-users" className="hover:text-blue-400">
                  Users
                </Link>
              )}
              <Link to="/dashboard" className="hover:text-blue-400">
                Dashboard
              </Link>
              <Link to="/beds" className="hover:text-blue-400">
                Beds
              </Link>
              <Link onClick={handleLogout} className="hover:text-red-400">
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-400">
                Login
              </Link>
              <Link to="/register" className="hover:text-blue-400">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;