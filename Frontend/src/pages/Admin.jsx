import React, { useState } from "react";
import { useAdmin } from "../context/AdminContext";
import ConfirmModal from "../components/ConfirmModal";
import { useAuth } from "../context/AuthContext";

const Admin = () => {
  const {
    stats,
    departments,
    users,
    loading,
    addWard,
    removeWard,
    addBed,
    removeBed,
    assignments,
  } = useAdmin();

  const { user } = useAuth();

  const [tab, setTab] = useState("departments");
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [newWardName, setNewWardName] = useState("");
  const [newBedId, setNewBedId] = useState("");

  // Confirmation modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({});

  if (loading) return <p className="p-8">Loading...</p>;

  const openConfirm = (title, message, onConfirm) => {
    setConfirmData({ title, message, onConfirm });
    setConfirmOpen(true);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setTab("departments")}
          className={`px-4 py-2 rounded ${
            tab === "departments" ? "bg-indigo-600 text-white" : "bg-gray-200"
          }`}
        >
          Departments & Wards
        </button>
        <button
          onClick={() => setTab("users")}
          className={`px-4 py-2 rounded ${
            tab === "users" ? "bg-indigo-600 text-white" : "bg-gray-200"
          }`}
        >
          Users
        </button>
      </div>

      {/* System Stats */}
      {stats && (
        <div className="mb-8 bg-white shadow p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">📊 System Stats</h2>
          <ul className="space-y-1">
            <li>Total Users: {stats.totalUsers}</li>
            <li>Total Departments: {stats.totalDepartments}</li>
            <li>
              Beds: {stats.beds.total} (Occupied: {stats.beds.occupied},
              Available: {stats.beds.available})
            </li>
          </ul>
        </div>
      )}

      {/* ========== TAB: DEPARTMENTS ========== */}
      {tab === "departments" && (
        <>
          {/* Department selection */}
          <div className="mb-6 bg-white shadow p-4 rounded-lg">
            <label className="block font-medium mb-2">Select Department</label>
            <select
              value={selectedDept?._id || ""}
              onChange={(e) => {
                const dept = departments.find((d) => d._id === e.target.value);
                setSelectedDept(dept);
                setSelectedWard(null);
              }}
              className="border p-2 rounded w-full"
            >
              <option value="">-- Select Department --</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Wards of selected department */}
          {selectedDept && (
            <div className="mb-6 bg-white shadow p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">
                Wards in {selectedDept.name}
              </h3>

              <ul className="space-y-2">
                {selectedDept.wards.map((ward) => (
                  <li
                    key={ward.name}
                    className={`p-2 border rounded flex justify-between ${
                      selectedWard?.name === ward.name ? "bg-indigo-100" : ""
                    }`}
                  >
                    <span>
                      {ward.name} ({ward.beds.length} beds)
                    </span>
                    <div className="space-x-2">
                      <button
                        onClick={() => setSelectedWard(ward)}
                        className="cp bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Manage Beds
                      </button>
                      <button
                        onClick={() =>
                          openConfirm(
                            "Remove Ward",
                            `Are you sure you want to remove ward "${ward.name}"?`,
                            () => removeWard(selectedDept._id, ward.name)
                          )
                        }
                        className="cp bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Add new ward */}
              <div className="mt-4 flex space-x-2">
                <input
                  type="text"
                  value={newWardName}
                  onChange={(e) => setNewWardName(e.target.value)}
                  placeholder="New ward name"
                  className="border p-2 rounded flex-1"
                />
                <button
                  onClick={() => {
                    if (newWardName.trim())
                      addWard(selectedDept._id, newWardName.trim());
                    setNewWardName("");
                  }}
                  className="cp bg-green-600 text-white px-4 py-2 rounded"
                >
                  Add Ward
                </button>
              </div>
            </div>
          )}

          {/* Beds in selected ward */}
          {selectedWard && (
            <div className="bg-white shadow p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">
                Beds in {selectedWard.name}
              </h3>

              <ul className="space-y-2">
                {/* Add new bed */}
                <div className="mt-4 flex space-x-2">
                  <input
                    type="text"
                    value={newBedId}
                    onChange={(e) => setNewBedId(e.target.value)}
                    placeholder="New bed ID"
                    className="border p-2 rounded flex-1"
                  />
                  <button
                    onClick={() => {
                      if (newBedId.trim())
                        addBed(
                          selectedDept._id,
                          selectedWard.name,
                          newBedId.trim()
                        );
                      setNewBedId("");
                    }}
                    className="cp bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Add Bed
                  </button>
                </div>

                {selectedWard.beds.map((bed) => (
                  <li
                    key={bed.id}
                    className="flex justify-between p-2 border rounded"
                  >
                    <span>
                      Bed ID: {bed.id} ({bed.status})
                    </span>
                    <button
                      onClick={() =>
                        openConfirm(
                          "Remove Bed",
                          `Are you sure you want to remove bed "${bed.id}"?`,
                          () =>
                            removeBed(
                              selectedDept._id,
                              selectedWard.name,
                              bed.id
                            )
                        )
                      }
                      className="cp bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Remove Bed
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* ========== TAB: USERS ========== */}
      {tab === "users" && (
        <div className="bg-white shadow p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">All Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Assigned Beds
                  </th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => {
                  const userAssignments = assignments.filter(
                    (assign) => assign.createdBy === u._id
                  );

                  return (
                    <tr key={u._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{u.role}</td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {userAssignments.length > 0 ? (
                          <ul className="list-disc list-inside space-y-1">
                            {userAssignments.map((assign, idx) => (
                              <li key={idx}>
                                <span className="font-medium">
                                  {assign.department.name} – {assign.ward}
                                </span>
                                <ul className="list-circle list-inside ml-4 text-sm text-gray-600">
                                  {assign.beds.map((bed) => (
                                    <li key={bed.id}>Bed {bed}</li>
                                  ))}
                                </ul>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400 italic">No beds</span>
                        )}
                      </td>


                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() =>
                            openConfirm(
                              "Delete User",
                              `Are you sure you want to delete user "${u.name}"?`,
                              () => console.log("TODO: deleteUser(u._id)")
                            )
                          }
                          className="cp bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        title={confirmData.title}
        message={confirmData.message}
        onConfirm={confirmData.onConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default Admin;
