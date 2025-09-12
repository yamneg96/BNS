import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllUsers } from "../services/auth";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, token } = useAuth;

  useEffect(() => {
    if (user && user.role === "admin" && token) {
      const fetchUsers = async () => {
        try {
          const fetchedUsers = await getAllUsers(token);
          setUsers(fetchedUsers);
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      };
      fetchUsers();
    } else {
      setLoading(false);
      setError("Forbidden: You do not have permission to view this page.");
    }
  }, [user, token]);

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading users...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">Error: {error}</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">All Users</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;