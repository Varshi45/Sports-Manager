import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/Globalcontext";
import { FiTrash } from "react-icons/fi";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { sports, setSports, setUser, user, matches, setMatches } =
    useGlobalContext();

  const fetchSports = useCallback(
    async (userId) => {
      if (!userId) return;
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_SERVER}/api/sports/admin/${userId}`,
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
    },
    [setSports]
  );

  const fetchMatches = useCallback(
    async (userId) => {
      if (!userId) return;
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_SERVER}/api/matches/admin/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch matches");
        const data = await response.json();
        setMatches(data);
      } catch (error) {
        console.error("Error fetching matches:", error);
        alert("An error occurred while fetching matches");
      }
    },
    [setMatches]
  );

  useEffect(() => {
    fetchSports(user.id);
    fetchMatches(user.id);
  }, [user.id, fetchSports, fetchMatches]);

  const deleteSport = async (sportId) => {
    if (!sportId) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}/api/sports/${sportId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete sport");
      alert("Sport deleted successfully");
      setSports((prevSports) =>
        prevSports.filter((sport) => sport.id !== sportId)
      );
    } catch (error) {
      console.error("Error deleting sport:", error);
      alert("An error occurred while deleting the sport");
    }
  };

  const deleteMatch = async (matchId) => {
    if (!matchId) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}/api/matches/${matchId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete match");
      alert("Match deleted successfully");
      setMatches((prevMatches) =>
        prevMatches.filter((match) => match.id !== matchId)
      );
    } catch (error) {
      console.error("Error deleting match:", error);
      alert("An error occurred while deleting the match");
    }
  };

  const handleSignout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/auth/signout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      localStorage.removeItem("token");
      setUser(null);
      setSports([]);
      setMatches([]);
      navigate("/");
    } catch (error) {
      console.error("Error during signout:", error);
      alert("An error occurred during signout");
    }
  };

  // Group matches by sportId
  const groupedMatches = matches.reduce((acc, match) => {
    (acc[match.sportId] = acc[match.sportId] || []).push(match);
    return acc;
  }, {});

  return (
    <div className="w-full flex flex-col h-screen">
      <header className="bg-blue-500 text-white py-4 flex justify-between items-center px-6">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <nav>
          <ul className="flex space-x-4">
            {/* <li>
              <button
                className="hover:text-gray-300"
                onClick={() => navigate("/admin/dashboard")}
              >
                Home
              </button>
            </li> */}
            <li>
              <button
                className="hover:text-gray-300"
                onClick={() => navigate("/admin/dashboard/profile")}
              >
                Profile
              </button>
            </li>
            <li>
              <button
                className="hover:text-gray-300"
                onClick={() => navigate("/admin/analysis")}
              >
                Analytics
              </button>
            </li>
            <li>
              <button
                className="hover:bg-red-400 bg-red-600 px-4 py-1 rounded"
                onClick={handleSignout}
              >
                Sign Out
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex flex-col items-center justify-center p-6 w-full">
        <div className="w-full bg-white bg-opacity-90 p-8 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-5 text-gray-800">
            Welcome to the Admin Dashboard!
          </h2>
        </div>

        <div className="w-full bg-white bg-opacity-90 p-8 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Sports Created:</h3>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => navigate("/admin/create-sport")}
            >
              Create Sport
            </button>
          </div>
          <div className="flex overflow-x-auto space-x-4 py-4">
            {sports.length > 0 ? (
              sports.map((sport) => (
                <div
                  key={sport.id}
                  className="relative flex-shrink-0 bg-blue-100 p-4 rounded-lg shadow-md hover:scale-105 hover:bg-blue-200"
                >
                  <h4 className="text-lg font-medium">{sport.name}</h4>
                  <button
                    className="absolute top-2 right-2 text-red-500 opacity-0 hover:opacity-100 transition-opacity duration-300"
                    onClick={() => deleteSport(sport.id)}
                  >
                    <FiTrash size={20} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No sports created yet.</div>
            )}
          </div>
        </div>

        <div className="w-full bg-white bg-opacity-90 p-8 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Matches:</h3>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => navigate("/admin/create-match")}
            >
              Create Match
            </button>
          </div>
          {sports.map((sport) => {
            const sportMatches = groupedMatches[sport.id];
            return (
              sportMatches &&
              sportMatches.length > 0 && (
                <div key={sport.id} className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {sport.name}
                  </h4>
                  <div className="overflow-x-auto py-2">
                    <div className="flex space-x-4">
                      {sportMatches.map((match) => (
                        <div
                          key={match.id}
                          className="bg-gray-100 p-4 rounded-lg shadow-md hover:scale-105 hover:bg-gray-200 flex-shrink-0 w-64"
                        >
                          <p className="text-gray-700">
                            Match: {match.team1} vs {match.team2}
                          </p>
                          <p className="text-gray-700">
                            Location: {match.location}
                          </p>
                          <p className="text-gray-700">
                            Date: {new Date(match.date).toLocaleString()}
                          </p>
                          <p className="text-gray-700">
                            Team Size: {match.teamSize}
                          </p>
                          <p className="text-gray-700">
                            Slots Remaining: {match.slotsRemaining}
                          </p>
                          <div className="mt-2">
                            <button
                              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                              onClick={() =>
                                navigate(`/match/${match.id}/players`)
                              }
                            >
                              Players Joined
                            </button>
                            <button
                              className="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                              onClick={() => deleteMatch(match.id)}
                            >
                              <FiTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
