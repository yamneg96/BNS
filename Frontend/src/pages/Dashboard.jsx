import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useAssignment } from "../context/AssignmentContext";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import Assignments from "./Assignments";
import { Menu, Bed, Bell, Users, LayoutDashboard } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [forceRequired, setForceRequired] = useState(false);
  const [updateAssign, setUpdateAssign] = useState(false);
  const { expiry, deptExpiry, wardExpiry, loading, fetchExpiry } = useAssignment();

  const hasExpiredAssignment = useMemo(() => {
    if (!expiry) return false;
    const today = new Date().toLocaleDateString('en-CA');
    const deptExpired = deptExpiry && today >= deptExpiry;
    const wardExpired = wardExpiry && today >= wardExpiry;
    return deptExpired || wardExpired;
  }, [expiry, deptExpiry, wardExpiry]);
  
  useEffect(() => {
    if (!loading && user) {
      const isFirstLogin = !user.firstLoginDone;
      if (isFirstLogin || hasExpiredAssignment) {
        setOpen(true);
        setForceRequired(true);
      } else {
        setForceRequired(false);
      }
    }
  }, [loading, user, hasExpiredAssignment]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (user) fetchExpiry();
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [user, fetchExpiry]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-xl shadow-2xl">
          <div className="text-6xl mb-4 animate-bounce">👋</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Please log in to view this page.
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 rounded-full shadow-lg transform hover:scale-105"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Hello, <span className="text-indigo-600">{user.name}</span>!
          </h1>
          <p className="text-xl text-gray-600 mt-2">
            Your role: <span className="font-semibold text-gray-800">{user.role}</span>
          </p>
        </div>

        {/* Dashboard Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Beds Card */}
          <Link
            to="/beds"
            className="dashboard-card group bg-white hover:bg-green-100 border-l-4 border-green-500 hover:border-green-600 transition-all duration-300"
          >
            <div className="bg-green-100 group-hover:bg-green-200 p-4 rounded-full inline-block transition-colors duration-300">
              <Bed size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-800 mt-4">Manage Beds</h3>
            <p className="text-sm text-gray-500 group-hover:text-green-700">Browse and assign beds.</p>
          </Link>

          {/* Notifications Card */}
          <Link
            to="/notifications"
            className="dashboard-card group bg-white hover:bg-yellow-100 border-l-4 border-yellow-500 hover:border-yellow-600 transition-all duration-300"
          >
            <div className="bg-yellow-100 group-hover:bg-yellow-200 p-4 rounded-full inline-block transition-colors duration-300">
              <Bell size={32} className="text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-yellow-800 mt-4">View Notifications</h3>
            <p className="text-sm text-gray-500 group-hover:text-yellow-700">Check for new admissions.</p>
          </Link>

          {/* My Assignments Card */}
          <Link
            to="/myassignments"
            className="dashboard-card group bg-white hover:bg-blue-100 border-l-4 border-blue-500 hover:border-blue-600 transition-all duration-300"
          >
            <div className="bg-blue-100 group-hover:bg-blue-200 p-4 rounded-full inline-block transition-colors duration-300">
              <LayoutDashboard size={32} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-800 mt-4">My Assignments</h3>
            <p className="text-sm text-gray-500 group-hover:text-blue-700">View beds assigned to you.</p>
          </Link>

          {/* Admin Access Card */}
          {user.role === "admin" && (
            <Link
              to="/admin"
              className="dashboard-card group bg-white hover:bg-purple-100 border-l-4 border-purple-500 hover:border-purple-600 transition-all duration-300"
            >
              <div className="bg-purple-100 group-hover:bg-purple-200 p-4 rounded-full inline-block transition-colors duration-300">
                <Users size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-800 mt-4">Admin Panel</h3>
              <p className="text-sm text-gray-500 group-hover:text-purple-700">Manage all system users.</p>
            </Link>
          )}
        </div>
      </div>

      <button
        onClick={() => {
          setOpen(true);
          setUpdateAssign(!updateAssign);
        }}
        className="cursor-pointer fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-lg transition-all duration-300 hover:bg-indigo-700 hover:scale-110 lg:hidden"
        aria-label="Open Assignments Menu"
      >
        <Menu size={24} />
      </button>

      {/* Modal */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        forceRequired={forceRequired}
        updateAssign={updateAssign}
      >
        <Assignments 
          updateAssign={updateAssign}
          closeModal={() => setOpen(false)} />
      </Modal>
    </div>
  );
};

export default Dashboard;