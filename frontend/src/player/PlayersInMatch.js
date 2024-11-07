// player/PlayersInMatch.js

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

const PlayersInMatch = () => {
  const { matchId } = useParams();
  const [players, setPlayers] = useState([]);

  const fetchPlayers = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}/api/joins/match/${matchId}/players`
      );
      const data = await response.json();
      setPlayers(data.players);
    } catch (error) {
      console.error("Error fetching players for the match:", error);
    }
  }, [matchId]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  return (
    <div className="w-full flex flex-col h-full p-6">
      <h1 className="text-2xl font-bold mb-4">Players in Match {matchId}</h1>
      <div className="bg-white p-4 rounded shadow-md">
        {players.length > 0 ? (
          <ul>
            {players.map((player) => (
              <li key={player.id} className="py-2 border-b">
                <p className="text-lg">{`${player.firstName} ${player.lastName}`}</p>{" "}
                {/* Updated name construction */}
                <p className="text-gray-600">{player.email}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No players have joined this match.</p>
        )}
      </div>
    </div>
  );
};

export default PlayersInMatch;
