import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  BellRing,
  Hospital,
  Bed,
  User,
  Building2,
} from "lucide-react";
import hosData from "../data/data";
import { useAuth } from "../context/AuthContext";
import {toast} from 'react-hot-toast'

const Beds = () => {
  const { user } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState(
    hosData.departments[0]
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleDepartmentSelect = (dept) => {
    setSelectedDepartment(dept);
    setIsSidebarOpen(false);
  };

  const currentDepartment =
    hosData.departments.find((dept) => dept.name === selectedDepartment.name) ||
    hosData.departments[0];

  // Handle actions
  const handleAdmit = (wardIndex, bedIndex) => {
    currentDepartment.wards[wardIndex].beds[bedIndex].status = "occupied";
    toast.success('Patient Admitted Successfully.')
  };

  const handleLeave = (wardIndex, bedIndex) => {
    currentDepartment.wards[wardIndex].beds[bedIndex].status = "available";
    currentDepartment.wards[wardIndex].beds[bedIndex].assignedUser = null;
    toast.success('Patient Discharged Successfully.')
  };

  const handleNotify = (assignedUser) => {
    if (assignedUser) {
      toast.success(`Notification sent to ${assignedUser.name} (${assignedUser.email})`);
    } else {
      toast.error("No user assigned to this bed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for Departments */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 lg:w-64 lg:border-r lg:border-gray-200`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Departments</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-gray-600 hover:text-gray-900 lg:hidden cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {hosData.departments.map((dept, index) => (
            <button
              key={index}
              onClick={() => handleDepartmentSelect(dept)}
              className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                selectedDepartment.name === dept.name
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {dept.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        {/* Toggle button for mobile */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="cursor-pointer fixed bottom-4 left-4 z-50 p-3 bg-indigo-600 text-white rounded-full shadow-lg lg:hidden"
        >
          <Menu size={24} />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center space-x-3 mb-2">
            <Building2 className="h-8 w-8 text-indigo-600" />
            <span>{currentDepartment.name}({currentDepartment.wards.length} Wards)</span>
          </h1>
          <p className="text-gray-500">
            Current user: {user?.name || "Not logged in"}
          </p>
        </div>

        {/* Wards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {currentDepartment.wards.map((ward, wardIndex) => {
            const totalBeds = ward.beds.length;
            const occupiedBeds = ward.beds.filter(
              (bed) => bed.status === "occupied"
            ).length;
            const availableBeds = totalBeds - occupiedBeds;

            return (
              <div
                key={wardIndex}
                className="bg-white rounded-lg p-4 shadow-md border border-gray-200"
              >
                <div className="flex items-center space-x-2 text-indigo-600 mb-2">
                  <Hospital className="h-6 w-6" />
                  <h3 className="text-lg font-semibold">{ward.name}</h3>
                </div>

                <details className="mt-4">
                  <summary className="cursor-pointer bg-indigo-600 text-white p-4 rounded-lg shadow-inner font-bold flex justify-between items-center">
                    <span>
                      Bed Status
                      <span className="ml-2 text-sm text-indigo-200">
                        ({occupiedBeds} occupied, {availableBeds} available)
                      </span>
                    </span>
                    <span className="text-xs text-indigo-200">
                      Click to view beds
                    </span>
                  </summary>
                  <div className="mt-4 space-y-4">
                    {ward.beds.map((bed, bedIndex) => (
                      <div
                        key={bedIndex}
                        className={`p-4 rounded-lg shadow-inner transition-colors duration-200 ${
                          bed.status === "occupied"
                            ? "bg-indigo-100 text-red-800 border-indigo-300"
                            : "bg-green-100 text-green-800 border-green-300"
                        }`}
                      >
                        <p className="font-bold flex items-center space-x-2">
                          <Bed className="h-5 w-5" />
                          <span>Bed ID: {bed.id}</span>
                        </p>
                        <p className="text-sm mt-2 flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>
                            Assigned to:{" "}
                            {bed.assignedUser?.name || "Not assigned"}
                          </span>
                        </p>
                        <p className="text-sm">
                          Email: {bed.assignedUser?.email || "N/A"}
                        </p>
                        <p className="text-sm mt-1">
                          Status:{" "}
                          <span className="font-semibold">
                            {bed.status.charAt(0).toUpperCase() +
                              bed.status.slice(1)}
                          </span>
                        </p>

                        {/* Action Buttons */}
                        <div className="mt-3 flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => handleNotify(bed.assignedUser)}
                            className="cursor-pointer flex-1 inline-flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600"
                          >
                            <BellRing className="h-4 w-4 mr-2" />
                            Notify
                          </button>
                          <button
                            onClick={() => handleAdmit(wardIndex, bedIndex)}
                            disabled={bed.status === "occupied"}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                              bed.status === "occupied"
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                            }`}
                          >
                            {bed.status === 'occupied' ?  'Patient Admitted' : 'Admit Patient'}
                          </button>
                          <button
                            onClick={() => handleLeave(wardIndex, bedIndex)}
                            disabled={bed.status === "available"}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                              bed.status === "available"
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                            }`}
                          >
                            {bed.status === 'available' ?  'Patient discharged' : 'Discharge Patient'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      </div>s
    </div>
  );
};

export default Beds;
