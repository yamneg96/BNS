import React, { useContext } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome to the Dashboard!
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Please log in to view this page.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-md transition duration-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Welcome to the Bed Assignment Dashboard, {user.name}!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Your role: <span className="font-bold text-indigo-600">{user.role}</span>
        </p>

        {user.role === "admin" && (
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              Admin Access
            </h2>
            <p className="text-blue-700 mb-4">
              You have privileged access to manage the system.
            </p>
            <Link
              to="/all-users"
              className="inline-block px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200"
            >
              View All Users
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="p-6 bg-green-50 rounded-lg border border-green-200">
            <h2 className="text-2xl font-bold text-green-800 mb-2">Beds</h2>
            <p className="text-green-700 mb-4">
              Browse and assign beds to patients.
            </p>
            <Link
              to="/beds"
              className="inline-block px-4 py-2 text-sm font-medium text-green-600 bg-green-100 rounded-md hover:bg-green-200"
            >
              Go to Beds
            </Link>
          </div>
          <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
            <h2 className="text-2xl font-bold text-yellow-800 mb-2">
              Notifications
            </h2>
            <p className="text-yellow-700 mb-4">
              View real-time patient admission notifications.
            </p>
            <Link
              to="/notifications"
              className="inline-block px-4 py-2 text-sm font-medium text-yellow-600 bg-yellow-100 rounded-md hover:bg-yellow-200"
            >
              Go to Notifications
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;