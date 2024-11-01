import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PlayerDashboard = () => {
  const [sports, setSports] = useState([]);
  const [matches, setMatches] = useState([]);
  const [joinedMatches, setJoinedMatches] = useState([]);
  const navigate = useNavigate();

  const fetchSportsAndMatches = async () => {
    try {
      const sportsResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}/sports`
      );
      const sportsData = await sportsResponse.json();
      setSports(sportsData);

      const matchesResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}/matches`
      );
      const matchesData = await matchesResponse.json();
      setMatches(matchesData);
    } catch (error) {
      console.error("Error fetching sports and matches:", error);
    }
  };

  // Fetch matches the player has joined
  const fetchJoinedMatches = async () => {
    const player = localStorage.getItem("user");
    const playerId = player ? JSON.parse(player).id : null;

    if (playerId) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_SERVER}/joins/player/${playerId}`
        );
        const data = await response.json();
        setJoinedMatches(data.joins.map((join) => join.matchId));
        console.log(joinedMatches);
      } catch (error) {
        console.error("Error fetching joined matches:", error);
      }
    }
  };

  useEffect(() => {
    fetchSportsAndMatches();
    fetchJoinedMatches();
  });

  const groupedMatches = matches.reduce((acc, match) => {
    (acc[match.sportId] = acc[match.sportId] || []).push(match);
    return acc;
  }, {});

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const joinMatch = async (matchId) => {
    const player = localStorage.getItem("user");
    const playerId = player ? JSON.parse(player).id : null;
    if (!playerId) {
      return alert("Please log in to join a match.");
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}/joins/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ playerId, matchId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to join match.");
      }

      const result = await response.json();
      alert(result.message);

      fetchSportsAndMatches();
      fetchJoinedMatches();
    } catch (error) {
      console.error("Error joining match:", error);
      alert("Could not join match.");
    }
  };

  return (
    <div className="w-full flex flex-col h-[100vh]">
      {/* Header with Navbar */}
      <header className="w-full bg-blue-500 text-white py-4 flex justify-between items-center px-6">
        <h1 className="text-xl font-bold">Player Dashboard</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <button
                className="hover:text-gray-300"
                onClick={() => navigate("/player/joined-matches")}
              >
                Matches-Joined
              </button>
            </li>
            <li>
              <button
                className="hover:bg-red-400 bg-red-600 px-4 py-1 rounded"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center m-6 p-6 w-full">
        <div className="flex items-center justify-center mt-4">
          <div className="max-w-7xl w-full bg-white bg-opacity-90 p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-5 text-gray-800">
              Welcome to the Player Dashboard!
            </h1>

            <div className="mt-8">
              {sports.length > 0 ? (
                sports.map((sport) => (
                  <div key={sport.id} className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      {sport.name}
                    </h2>
                    <div className="flex overflow-x-auto space-x-4 py-2">
                      {groupedMatches[sport.id] &&
                      groupedMatches[sport.id].length > 0 ? (
                        groupedMatches[sport.id].map((match) => (
                          <div
                            key={match.id}
                            className="bg-gray-100 p-4 rounded-lg shadow-md hover:scale-105 flex-shrink-0 w-64"
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
                            {joinedMatches.includes(match.id) ? (
                              <button
                                className="mt-2 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                                onClick={() =>
                                  navigate(`/match/${match.id}/players`)
                                }
                              >
                                See Other Players Joined
                              </button>
                            ) : (
                              <button
                                className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                                onClick={() => joinMatch(match.id)}
                              >
                                Join Match
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No matches available.</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No sports available.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlayerDashboard;
