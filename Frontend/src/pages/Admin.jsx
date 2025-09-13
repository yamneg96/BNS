import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllUsers } from "../services/auth";
import { updateData, getStats } from "../services/adminService";

const Admin = () => {
  const [stats, setStats] = useState({});
  const [form, setForm] = useState({ beds: "", wards: "", available: "", rejected: "" });
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState("");

  const { user, token } = useAuth();

  // Fetch system stats
  useEffect(() => {
    if (user?.role === "admin" && token) {
      (async () => {
        try {
          const data = await getStats();
          setStats(data);
        } catch (err) {
          setError("Failed to load system stats");
        }
      })();
    }
  }, [user, token]);

  // Fetch users (optional read-only list)
  useEffect(() => {
    if (user?.role === "admin" && token) {
      (async () => {
        try {
          const fetchedUsers = await getAllUsers(token);
          setUsers(fetchedUsers);
          setLoadingUsers(false);
        } catch (err) {
          setError("Failed to load users");
          setLoadingUsers(false);
        }
      })();
    }
  }, [user, token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateData(form);
      alert("System data updated!");
      const updated = await getStats();
      setStats(updated);
    } catch (err) {
      alert("Failed to update data");
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="p-8 text-center text-red-600">
        Forbidden: You do not have permission to view this page.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-lg space-y-10">
        {/* System Stats Section */}
        <section>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Panel</h1>
          <p className="mb-2 text-gray-700 font-medium">📊 Current System Stats:</p>
          <ul className="mb-4 space-y-1">
            <li>Beds: {stats.beds}</li>
            <li>Wards: {stats.wards}</li>
            <li>Available: {stats.available}</li>
            <li>Rejected: {stats.rejected}</li>
          </ul>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="beds"
              placeholder="Number of Beds"
              className="border p-2 w-full"
              onChange={handleChange}
            />
            <input
              name="wards"
              placeholder="Number of Wards"
              className="border p-2 w-full"
              onChange={handleChange}
            />
            <input
              name="available"
              placeholder="Available Beds"
              className="border p-2 w-full"
              onChange={handleChange}
            />
            <input
              name="rejected"
              placeholder="Rejected Beds"
              className="border p-2 w-full"
              onChange={handleChange}
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Update
            </button>
          </form>
        </section>

        {/* Users List Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">All Users (Read-Only)</h2>
          {loadingUsers ? (
            <p className="text-gray-600">Loading users...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{u.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{u.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Admin;
