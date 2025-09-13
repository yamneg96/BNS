import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="border p-4 rounded shadow bg-white max-w-sm">
        <img src={user.image || "/default-avatar.png"} alt="Profile" className="w-20 h-20 rounded-full mb-4 mx-auto" />
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>ID:</strong> {user._id}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  );
};

export default Profile;
