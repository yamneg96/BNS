import React, { useState, useEffect } from "react";
import { createAssignment } from "../services/assignment";
import { useAssignment } from "../context/AssignmentContext";
import { useAuth } from "../context/AuthContext";
import { getDepartments } from "../services/department"; 
import { toast } from "react-hot-toast";

const Assignments = ({ closeModal }) => {
  const { user } = useAuth();
  const { fetchActive } = useAssignment();

  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    deptId: "",
    wardName: "",
    beds: [],
    deptExpiry: "",
    wardExpiry: "",
  });

  // Load departments from backend
  useEffect(() => {
    getDepartments().then(setDepartments).catch(console.error);
  }, []);

  const handleDeptChange = (e) => {
    setForm({ ...form, deptId: e.target.value, wardName: "", beds: [] });
  };

  const handleWardChange = (e) => {
    setForm({ ...form, wardName: e.target.value, beds: [] });
  };

  const handleBedToggle = (bedId) => {
    const newBeds = form.beds.includes(bedId)
      ? form.beds.filter((id) => id !== bedId)
      : [...form.beds, bedId];
    setForm({ ...form, beds: newBeds });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAssignment(form);
      toast.success("Assignment saved!");
      await fetchActive();
      closeModal();
    } catch (err) {
      console.error(err);
      console.log(err.response.data);
      toast.error("Failed to save assignment");
    }
  };

  const selectedDept = departments.find((d) => d._id === form.deptId);
  const selectedWard = selectedDept?.wards.find((w) => w.name === form.wardName);

  // Validation: enable save only if all required fields are filled
  const isFormValid =
    form.deptId &&
    form.deptExpiry &&
    form.wardName &&
    form.wardExpiry &&
    form.beds.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-2">Insert your assigned beds</h2>

      {/* Department radio */}
      <div>
        <label className="block font-semibold">Select Department:</label>
        {departments.map((dept) => (
          <label key={dept._id} className="block">
            <input
              type="radio"
              name="department"
              value={dept._id}
              checked={form.deptId === dept._id}
              onChange={handleDeptChange}
              required
              className="text-center border-1 border-indigo-500 "
            />{" "}
            {dept.name}
          </label>
        ))}
      </div>

      {/* Dept expiry */}
      <div>
        <label className="block font-semibold">Department Expiry:</label>
        <input
          type="date"
          className="border p-2 w-full rounded-md"
          value={form.deptExpiry}
          onChange={(e) => setForm({ ...form, deptExpiry: e.target.value })}
          required
        />
      </div>

      {/* Ward select */}
      {selectedDept && (
        <div>
          <label className="block font-semibold">Select Ward:</label>
          <select
            className="border p-2 w-full rounded-md"
            value={form.wardName}
            onChange={handleWardChange}
            required
          >
            <option value="">-- Select Ward --</option>
            {selectedDept.wards.map((w, idx) => (
              <option key={idx} value={w.name}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Ward expiry */}
      {form.wardName && (
        <div>
          <label className="block font-semibold">Ward Expiry:</label>
          <input
            type="date"
            className="border p-2 w-full rounded-md"
            value={form.wardExpiry}
            onChange={(e) => setForm({ ...form, wardExpiry: e.target.value })}
            required
          />
        </div>
      )}

      {/* Beds checkboxes */}
      {selectedWard && (
        <div>
          <label className="block font-semibold">Select Beds:</label>
          <div className="grid grid-cols-2 gap-2">
            {selectedWard.beds.map((bed) => (
              <label key={bed.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={bed.id}
                  checked={form.beds.includes(bed.id)}
                  onChange={() => handleBedToggle(bed.id)}
                  // disabled={bed.status === "occupied"} Commented this so that the occupied also can be assigned.
                />
                <span>
                  Bed {bed.id} ({bed.status})
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Save button disabled until form valid */}
      <button
        type="submit"
        disabled={!isFormValid}
        className={`px-4 py-2 rounded w-full ${
          isFormValid
            ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
      >
        Save Assignment
      </button>
    </form>
  );
};

export default Assignments;
