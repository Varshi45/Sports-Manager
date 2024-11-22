import React, { useState } from "react";
import { useGlobalContext } from "../context/Globalcontext";
import { FaPencilAlt } from "react-icons/fa";

const Profile = () => {
  const { user, setUser } = useGlobalContext(); // Use setUser to update local user data
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-700">
          No user data available. Please log in.
        </p>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}/api/auth/update-names`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user.id,
            role: user.role,
            firstName: editedUser.firstName,
            lastName: editedUser.lastName,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user details");
      }

      const updatedData = await response.json();

      // Update local user instance
      setUser((prevUser) => ({
        ...prevUser,
        firstName: updatedData.user.firstName,
        lastName: updatedData.user.lastName,
      }));

      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md bg-white bg-opacity-90 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-5 text-gray-800">
          User Profile
        </h1>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <div className="space-y-4 text-gray-700">
          <div className="flex items-center justify-between">
            <p>
              <strong>First Name:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={editedUser.firstName}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300"
                />
              ) : (
                user.firstName
              )}
            </p>
            {!isEditing && (
              <button onClick={handleEdit} className="text-blue-500">
                <FaPencilAlt />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p>
              <strong>Last Name:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={editedUser.lastName}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300"
                />
              ) : (
                user.lastName
              )}
            </p>
            {!isEditing && (
              <button onClick={handleEdit} className="text-blue-500">
                <FaPencilAlt />
              </button>
            )}
          </div>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
        </div>
        {isEditing && (
          <div className="mt-4 flex space-x-3">
            <button
              onClick={handleSave}
              className={`bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Details"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
