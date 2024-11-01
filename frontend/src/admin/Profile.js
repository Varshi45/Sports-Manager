import React from "react";
import { useGlobalContext } from "../context/Globalcontext";

const Profile = () => {
  const { user } = useGlobalContext();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-700">
          No user data available. Please log in.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md bg-white bg-opacity-90 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-5 text-gray-800">
          User Profile
        </h1>
        <div className="space-y-4 text-gray-700">
          <p>
            <strong>First Name:</strong> {user.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
