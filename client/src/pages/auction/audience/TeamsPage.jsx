import React, { useState } from "react";
import { dummyTeams } from "../../../assets/assets";
import { PlayerSoFar } from "../../../components/auction/PlayerSoFar";
import { dummyPlayers } from "../../../assets/assets";

const TeamsPage = () => {
  const [sortKey, setSortKey] = useState("name"); // default sort by player name
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortPlayers = (players) => {
    // get full player objects from IDs
    const playerObjects = players.map((id) =>
      dummyPlayers.find((p) => p.id === id)
    );

    return playerObjects.sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  return (
    <div className="px-7 md:px-20 py-12 space-y-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
          Teams Overview
        </h1>
        <p className="text-gray-500 mt-2">
          Track all teams’ budget, players bought, and lineup so far during the
          auction.
        </p>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
        {dummyTeams.map((team, index) => {
          // Calculate budget spent %
          const totalSpent = team.playersBought.reduce((acc, playerId) => {
            const player = dummyPlayers.find((p) => p.id === playerId);
            return acc + (player?.soldPrice || 0);
          }, 0);
          const budgetSpentPercent =
            (totalSpent / (totalSpent + team.budgetLeft)) * 100;

          return (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 space-y-6 hover:shadow-lg transition-shadow"
            >
              {/* Team Header */}
              <div className="flex items-center space-x-4">
                <img
                  src={team.logo}
                  alt={`${team.name} logo`}
                  className="w-20 h-20 object-contain"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {team.name}
                  </h3>
                  <p className="text-gray-600">
                    <strong>Budget Left:</strong> $
                    {team.budgetLeft.toLocaleString()}
                  </p>
                  <p className="text-gray-600">
                    <strong>Total Players Bought:</strong>{" "}
                    {team.playersBought.length}
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{
                        width: `${budgetSpentPercent.toFixed(1)}%`,
                        backgroundColor: (() => {
                          const pct = budgetSpentPercent;
                          if (pct <= 10) return "#10B981"; // green
                          if (pct <= 20) return "#22C55E";
                          if (pct <= 30) return "#4ADE80";
                          if (pct <= 40) return "#86EFAC";
                          if (pct <= 50) return "#FACC15"; // yellow
                          if (pct <= 60) return "#FBBF24";
                          if (pct <= 70) return "#F97316"; // orange
                          if (pct <= 80) return "#F87171"; // red-orange
                          if (pct <= 90) return "#EF4444"; // red
                          return "#B91C1C"; // dark red
                        })(),
                      }}
                    ></div>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    Budget spent: {budgetSpentPercent.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Lineup Section */}
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">
                  Lineup So Far
                </h4>
                {team.playersBought.length === 0 ? (
                  <p className="text-gray-500">No players bought yet.</p>
                ) : (
                  <div className="space-y-4">
                    {/* Sorting Buttons */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {[
                        "name",
                        "role",
                        "batSkill",
                        "bowlSkill",
                        "soldPrice",
                      ].map((key) => (
                        <button
                          key={key}
                          onClick={() => handleSort(key)}
                          className={`px-3 py-1 rounded-full text-sm border ${
                            sortKey === key
                              ? "bg-blue-600 text-white border-blue-600"
                              : "text-gray-700 border-gray-300"
                          }`}
                        >
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                          {sortKey === key &&
                            (sortOrder === "asc" ? " ↑" : " ↓")}
                        </button>
                      ))}
                    </div>

                    {/* Players */}
                    {sortPlayers(team.playersBought).map((player) => (
                      <PlayerSoFar key={player.id} playerId={player.id} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamsPage;
