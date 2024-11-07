import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateSportForm = () => {
  const [sportName, setSportName] = useState("");
  const navigate = useNavigate();

  const handleCreateSport = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}/api/sports/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: sportName,
          }),
        }
      );

      if (response.ok) {
        alert("Sport created successfully!");
        setSportName("");
        navigate("/admin/dashboard");
      } else {
        alert("Failed to create sport");
      }
    } catch (error) {
      console.error("Error creating sport:", error);
      alert("An error occurred while creating the sport");
    }
  };

  return (
    <div className="max-w-md w-full bg-white bg-opacity-90 p-8 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Create a Sport
      </h2>
      <form onSubmit={handleCreateSport} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Sport Name</label>
          <input
            type="text"
            value={sportName}
            onChange={(e) => setSportName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Sport
        </button>
      </form>
    </div>
  );
};

export default CreateSportForm;
