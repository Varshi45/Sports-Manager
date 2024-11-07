import React, { useEffect, useState, useCallback } from "react";

const AdminAnalysis = () => {
  const [sports, setSports] = useState([]);
  const [matches, setMatches] = useState([]);
  const [matchesWithPlayerCounts, setMatchesWithPlayerCounts] = useState([]);

  const adminId = JSON.parse(localStorage.getItem("user"))?.id;

  const fetchSportsByAdmin = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}/api/sports/admin/${adminId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const sportsData = await response.json();
      setSports(sportsData);
    } catch (error) {
      console.error("Error fetching sports by admin:", error);
    }
  }, [adminId]);

  const fetchMatches = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}/api/matches/admin/${adminId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const matchesData = await response.json();
      setMatches(matchesData);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  }, [adminId]);

  useEffect(() => {
    if (adminId) {
      fetchSportsByAdmin();
      fetchMatches();
    }
  }, [adminId, fetchSportsByAdmin, fetchMatches]);

  const sortedSports = sports
    .map((sport) => ({
      ...sport,
      matchCount: matches.filter((match) => match.sportId === sport.id).length,
    }))
    .sort((a, b) => b.matchCount - a.matchCount);

  const fetchPlayerCounts = useCallback(async () => {
    try {
      const updatedMatches = await Promise.all(
        matches.map(async (match) => {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_SERVER}/api/joins/match/${match.id}/players`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch players for match");
          }

          const data = await response.json();
          return {
            ...match,
            playerCount: data.players.length || 0,
          };
        })
      );

      setMatchesWithPlayerCounts(
        updatedMatches.sort((a, b) => b.playerCount - a.playerCount)
      );
    } catch (error) {
      console.error("Error fetching player counts:", error);
    }
  }, [matches]);

  useEffect(() => {
    fetchPlayerCounts();
  }, [fetchPlayerCounts]);

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-4">
        Admin Match and Sports Analysis
      </h1>

      <h2 className="text-xl font-semibold mb-2">
        Sports Sorted by Matches Created
      </h2>
      <div className="bg-white p-4 rounded shadow-md mb-6">
        <ul>
          {sortedSports.map((sport) => (
            <li key={sport.id} className="py-2 border-b flex justify-between">
              <span>{sport.name}</span>
              <span>{sport.matchCount} matches</span>
            </li>
          ))}
        </ul>
      </div>

      <h2 className="text-xl font-semibold mb-2">
        Matches Sorted by Number of Players Joined
      </h2>
      <div className="bg-white p-4 rounded shadow-md">
        <ul>
          {matchesWithPlayerCounts.map((match) => {
            // Find the sport associated with the current match
            const sport = sports.find((sport) => sport.id === match.sportId);
            return (
              <li key={match.id} className="py-2 border-b flex justify-between">
                <span>
                  {match.team1} vs {match.team2}{" "}
                </span>
                <span>{sport ? `${sport.name}` : "(Sport not found)"}</span>
                <span>{match.playerCount} players joined</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default AdminAnalysis;
