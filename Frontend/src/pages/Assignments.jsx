import React, { useState } from "react";
import { assignBed } from "../services/bedService";
import {toast} from 'react-hot-toast'

const Assignments = ({ closeModal }) => {
  const [form, setForm] = useState({ bedName: "", bedId: "", ward: "", department: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await assignBed(form);
      toast.success("Bed assigned successfully!");
      closeModal();
    } catch (err) {
      toast.error("Error assigning bed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h2 className="text-xl font-bold mb-2">Assign My Beds for Today</h2>
      <input name="bedName" placeholder="Bed Name" type="text" className="border p-2 w-full rounded-md" onChange={handleChange} required />
      <input name="bedId" placeholder="Bed ID" type="number" className="border p-2 w-full rounded-md" onChange={handleChange} required />
      <input name="ward" placeholder="Ward Name" type="text" className="border p-2 w-full rounded-md" onChange={handleChange} required/>
      <input name="department" placeholder="Department" type="text" className="border p-2 w-full rounded-md" onChange={handleChange} required />
      <input name="date" placeholder="Expires at" type="date" className="border p-2 w-full rounded-md" onChange={handleChange} required />
      <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">Save</button>
    </form>
  );
};

export default Assignments;
