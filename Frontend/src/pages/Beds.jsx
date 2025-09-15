import React, { useState } from "react";
import { Menu, X, Hospital, Bed, User, Building2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useBed } from "../context/BedContext";
import toast from "react-hot-toast";

const Beds = () => {
  const { user } = useAuth();
  const { departments, loading, admit, discharge } = useBed();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) {
    return <div className="text-center mt-10">Loading departments...</div>;
  }

  const currentDepartment =
    selectedDepartment || (departments.length > 0 ? departments[0] : null);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
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
          {departments.map((dept) => (
            <button
              key={dept._id}
              onClick={() => {
                setSelectedDepartment(dept);
                setIsSidebarOpen(false);
              }}
              className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                currentDepartment?._id === dept._id
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {dept.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        {/* Toggle mobile */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="cursor-pointer fixed bottom-4 left-4 z-50 p-3 bg-indigo-600 text-white rounded-full shadow-lg lg:hidden"
        >
          <Menu size={24} />
        </button>

        {currentDepartment && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center space-x-3 mb-2">
                <Building2 className="h-8 w-8 text-indigo-600" />
                <span>
                  {currentDepartment.name} ({currentDepartment.wards.length} Wards)
                </span>
              </h1>
              <p className="text-gray-500">
                Current user: {user?.name || "Not logged in"}
              </p>
            </div>

            {/* Wards */}
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
                        {ward.beds.map((bed) => (
                          <div
                            key={bed.id}
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
                              <span className="font-semibold">{bed.status}</span>
                            </p>

                            {/* Action buttons */}
                            <div className="mt-3 flex flex-col sm:flex-row gap-2">
                              <button
                                onClick={() => {
                                  if (bed.assignedUser?._id === user._id) {
                                    toast.error("You cannot admit yourself.");
                                  } else {
                                    admit(currentDepartment._id, ward.name, bed.id);
                                  }
                                }}
                                disabled={bed.status === "occupied"}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                                  bed.assignedUser === user?._id ? (
                                    'cursor-not-allowed'
                                  ) : (
                                    bed.status === "occupied"
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                                )}`}
                              >
                                {bed.status === "occupied"
                                  ? "Patient Admitted"
                                  : "Admit Patient"}
                              </button>
                              <button
                                onClick={() => {
                                  if (bed.assignedUser?._id === user._id) {
                                    toast.error("You cannot discharge yourself.");
                                  } else {
                                    discharge(currentDepartment._id, ward.name, bed.id);
                                  }
                                }}
                                disabled={bed.status === "available"}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                                  bed.assignedUser === user?._id ? (//This is for to avoid user from clicking but even if clicked it won't send notification(so not to worry. 😎)
                                    'cursor-not-allowed'
                                  ) : (bed.status === "available" ? "bg-gray-300 text-gray-600 cursor-not-allowed" : 
                                    "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                                )}`}
                              >
                                {bed.status === "available"
                                  ? "Patient Discharged"
                                  : "Discharge Patient"}
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
          </>
        )}
      </div>
    </div>
  );
};

export default Beds;
