import React, { useState } from "react";
import { dummyTeams, dummyPlayers } from "../../../assets/assets";

const MyTeamPage = () => {
  const [sortKey, setSortKey] = useState("name"); // default sort by player name
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc

  // --- Select which team to display by its index (0-5) ---
  const teamIndex = 3; 
  const team = dummyTeams[teamIndex];
  // ---------------------------------------------------------

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

      // Handle case-insensitive string sorting
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      // Perform comparison
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Calculate budget spent percentage
  const totalSpent = team.playersBought.reduce((acc, playerId) => {
    const player = dummyPlayers.find((p) => p.id === playerId);
    return acc + (player?.soldPrice || 0);
  }, 0);

  const budgetSpentPercent = team.budgetLeft + totalSpent > 0 
    ? (totalSpent / (totalSpent + team.budgetLeft)) * 100 
    : 0;

  return (
    <div className="px-7 md:px-20 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
          My Team Overview
        </h1>
        <p className="text-gray-500 mt-2">
          Track your team's budget, players bought, and lineup so far during the auction.
        </p>
      </div>

      {/* Single Team Display */}
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-6 md:p-8 space-y-6">
        {/* Team Header */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <img
            src={team.logo}
            alt={`${team.name} logo`}
            className="w-24 h-24 object-contain"
          />
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-3xl font-bold text-gray-800">
              {team.name}
            </h3>
            <p className="text-gray-600 mt-1">
              <strong>Budget Left:</strong> ${team.budgetLeft.toLocaleString()}
            </p>
            <p className="text-gray-600">
              <strong>Total Players Bought:</strong> {team.playersBought.length}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
              <div
                className="h-3 rounded-full transition-all"
                style={{
                  width: `${budgetSpentPercent.toFixed(1)}%`,
                  backgroundColor: (() => {
                    const pct = budgetSpentPercent;
                    if (pct <= 25) return "#22C55E"; // green
                    if (pct <= 50) return "#FACC15"; // yellow
                    if (pct <= 75) return "#F97316"; // orange
                    return "#EF4444"; // red
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
          <h4 className="text-xl font-semibold text-gray-800 mb-4 border-t pt-6">
            Lineup So Far
          </h4>
          {team.playersBought.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No players bought yet.</p>
          ) : (
            <div className="space-y-4">
              {/* Sorting Buttons */}
              <div className="flex flex-wrap gap-2 mb-3">
                {["name", "role", "batSkill", "bowlSkill", "soldPrice"].map((key) => (
                  <button
                    key={key}
                    onClick={() => handleSort(key)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                      sortKey === key
                        ? "bg-blue-600 text-white border-blue-600"
                        : "text-gray-700 bg-white hover:bg-gray-100 border-gray-300"
                    }`}
                  >
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    {sortKey === key && (sortOrder === "asc" ? " ↑" : " ↓")}
                  </button>
                ))}
              </div>

              {/* Players List */}
              <div className="space-y-3">
                {sortPlayers(team.playersBought).map((player) => (
                  <div key={player.id} className="p-3 border rounded-md hover:shadow-md transition-shadow cursor-pointer bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div className="font-semibold text-gray-800">
                        {player.name}
                      </div>
                      <div className="text-blue-600 font-bold">
                        ${player.soldPrice?.toLocaleString() || player.basePrice}
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600 mt-1">
                      <span>Bat: {player.batSkill}</span>
                      <span>Bowl: {player.bowlSkill}</span>
                      <span>Country: {player.country}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTeamPage;