import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bedIcon from "../assets/medical-bed.png";
import { X, Menu } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    navigate("/");
    logout();
  };

  return (
    <nav className="p-4 bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2">
          <img src={bedIcon} alt="Bed Icon" className="h-8" />
          <Link to="/" className="text-xl font-bold font-inter">
            BNS
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4 font-medium">
          {user && user?.subscription?.isActive ? (
            <>
              <span className="text-gray-300">
                Hello, {user.name} ({user.role})
              </span>
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
              <button onClick={handleLogout} className="hover:text-red-400">
                Logout
              </button>
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

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="focus:outline-none cursor-pointer">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-2 font-medium">
          {user && user.subscription.isActive ? (
            <>
              <span className="block px-4 py-2 text-sm text-gray-300">
                Hello, {user.name} ({user.role})
              </span>
              {user.role === "admin" && (
                <Link
                  to="/all-users"
                  onClick={toggleMenu}
                  className="block px-4 py-2 hover:bg-gray-700 transition duration-200"
                >
                  Users
                </Link>
              )}
              <Link
                to="/dashboard"
                onClick={toggleMenu}
                className="block px-4 py-2 hover:bg-gray-700 transition duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/beds"
                onClick={toggleMenu}
                className="block px-4 py-2 hover:bg-gray-700 transition duration-200"
              >
                Beds
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-2 hover:bg-red-700 text-red-400 transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={toggleMenu}
                className="block px-4 py-2 hover:bg-gray-700 transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={toggleMenu}
                className="block px-4 py-2 hover:bg-gray-700 transition duration-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;