import React, { useState } from "react";
import { assignBed } from "../services/bedService";

const Assignments = ({ closeModal }) => {
  const [form, setForm] = useState({ bedName: "", bedId: "", ward: "", department: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await assignBed(form);
      alert("Bed assigned successfully!");
      closeModal();
    } catch (err) {
      alert("Error assigning bed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h2 className="text-xl font-bold mb-2">Assign My Beds for Today</h2>
      <input name="bedName" placeholder="Bed Name" className="border p-2 w-full" onChange={handleChange} />
      <input name="bedId" placeholder="Bed ID" className="border p-2 w-full" onChange={handleChange} />
      <input name="ward" placeholder="Ward Name" className="border p-2 w-full" onChange={handleChange} />
      <input name="department" placeholder="Department" className="border p-2 w-full" onChange={handleChange} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
    </form>
  );
};

export default Assignments;
