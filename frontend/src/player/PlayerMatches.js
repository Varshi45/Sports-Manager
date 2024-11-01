// player/PlayerMatches.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PlayerMatches = () => {
  const [joinedMatches, setJoinedMatches] = useState([]);
  const navigate = useNavigate();

  const fetchJoinedMatches = async () => {
    const player = localStorage.getItem("user");
    const playerId = player ? JSON.parse(player).id : null;

    if (playerId) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_SERVER}/joins/player/${playerId}`
        );
        const data = await response.json();
        setJoinedMatches(data.joins);
      } catch (error) {
        console.error("Error fetching joined matches:", error);
      }
    }
  };

  useEffect(() => {
    fetchJoinedMatches();
  }, []);

  return (
    <div className="w-full flex flex-col h-[100vh] p-6">
      <header className="w-full bg-blue-500 text-white py-4 flex justify-between items-center px-6">
        <h1 className="text-xl font-bold">Joined Matches</h1>
        <button
          className="hover:bg-red-400 bg-red-600 px-4 py-1 rounded"
          onClick={() => navigate("/player/dashboard")}
        >
          Back to Dashboard
        </button>
      </header>

      <main className="flex flex-col items-center justify-center mt-6 w-full">
        <div className="max-w-7xl w-full bg-white bg-opacity-90 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-5 text-gray-800">
            Your Joined Matches
          </h2>
          {joinedMatches.length > 0 ? (
            <ul className="space-y-4">
              {joinedMatches.map((join) => (
                <li
                  key={join.matchId}
                  className="bg-gray-100 p-4 rounded-lg shadow-md"
                >
                  <h3 className="text-gray-700">Match ID: {join.matchId}</h3>
                  <button
                    className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                    onClick={() => navigate(`/match/${join.matchId}/players`)}
                  >
                    See Other Players Joined
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">You have not joined any matches.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default PlayerMatches;
