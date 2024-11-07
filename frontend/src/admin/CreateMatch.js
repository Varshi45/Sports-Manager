import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/Globalcontext";

const CreateMatchForm = () => {
  const navigate = useNavigate();
  const { user } = useGlobalContext();
  const [sports, setSports] = useState([]);
  const [selectedSportId, setSelectedSportId] = useState("");
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [teamSize, setTeamSize] = useState("");

  useEffect(() => {
    const fetchSports = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_SERVER}/api/sports/admin/${user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch sports");
        const data = await response.json();
        setSports(data);
      } catch (error) {
        console.error("Error fetching sports:", error);
        alert("An error occurred while fetching sports");
      }
    };

    fetchSports();
  }, [user]);

  // Set the minimum date to current date and time
  const minDate = new Date().toISOString().slice(0, 16);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedSportId ||
      !team1 ||
      !team2 ||
      !location ||
      !date ||
      !teamSize
    ) {
      alert("Please fill in all fields.");
      return;
    }

    // Check if the selected date is in the past
    const selectedDate = new Date(date);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      alert("Please select a date and time that is in the future.");
      return;
    }

    const newMatch = {
      sportId: selectedSportId,
      team1,
      team2,
      location,
      date,
      teamSize,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}/api/matches/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newMatch),
        }
      );
      if (!response.ok) throw new Error("Failed to create match");
      alert("Match created successfully!");
      navigate("/admin/dashboard"); // Redirect to the dashboard or matches page
    } catch (error) {
      console.error("Error creating match:", error);
      alert("An error occurred while creating the match");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="max-w-md w-full bg-white bg-opacity-90 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Create Match
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="sport">
              Select Sport
            </label>
            <select
              id="sport"
              value={selectedSportId}
              onChange={(e) => setSelectedSportId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">-- Select a Sport --</option>
              {sports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="team1">
              Team 1
            </label>
            <input
              type="text"
              id="team1"
              value={team1}
              onChange={(e) => setTeam1(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="team2">
              Team 2
            </label>
            <input
              type="text"
              id="team2"
              value={team2}
              onChange={(e) => setTeam2(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="location">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="date">
              Date
            </label>
            <input
              type="datetime-local"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              min={minDate} // Set minimum date
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="teamSize">
              Team Size
            </label>
            <input
              type="number"
              id="teamSize"
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Match
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMatchForm;
