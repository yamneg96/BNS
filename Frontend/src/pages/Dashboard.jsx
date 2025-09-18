import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useAssignment } from "../context/AssignmentContext";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import Assignments from "./Assignments";

const Dashboard = () => {
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [forceRequired, setForceRequired] = useState(false);

  const { expiry, deptExpiry, wardExpiry, loading, fetchExpiry } = useAssignment();

  const hasExpiredAssignment = useMemo(() => {
    if (!expiry) return false;
    const today = new Date().toLocaleDateString('en-CA');
    const deptExpired = deptExpiry && today >= deptExpiry;
    const wardExpired = wardExpiry && today >= wardExpiry;
    return deptExpired || wardExpired;
  }, [expiry]);
  
  useEffect(() => {
    if (!loading && user) {
      const isFirstLogin = !user.firstLoginDone; // only once ever
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
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto p-6 rounded-xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Welcome to the Bed Assignment Dashboard, {user.name}!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Your role:{" "}
          <span className="font-bold text-indigo-600">{user.role}</span>
        </p>

        {/* Admin section */}
        {user.role === "admin" && (
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              Admin Access
            </h2>
            <p className="text-blue-700 mb-4">
              You have privileged access to manage the system.
            </p>
            <Link
              to="/admin"
              className="inline-block px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200"
            >
              View All Users
            </Link>
          </div>
        )}

        {/* Quick actions */}
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

      {/* Modal */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        forceRequired={forceRequired}
      >
        <Assignments closeModal={() => setOpen(false)} />
      </Modal>
    </div>
  );
};

export default Dashboard;
