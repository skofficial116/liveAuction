import React, { useState, useEffect } from "react";
import axios from "axios";
// Utility: format "x time ago"
const getTimeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - new Date(timestamp)) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
};

// Player Modal Component
const PlayerModal = ({ player, team, onClose }) => {
  if (!player) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">
              {player.name}
            </h3>
            <p className="text-sm text-gray-500">
              {player.country || "—"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-2 flex-shrink-0"
          >
            ×
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between py-2 sm:py-3 border-b">
            <span className="text-gray-600 text-sm sm:text-base">Team</span>
            <span
              className="font-semibold text-sm sm:text-base"
              style={{ color: team.color }}
            >
              {team.short}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 sm:py-3 border-b">
            <span className="text-gray-600 text-sm sm:text-base">Price</span>
            <span className="font-semibold text-green-600 text-sm sm:text-base">
              ₹{player.sold?.price}L
            </span>
          </div>

          <div className="flex items-center justify-between py-2 sm:py-3 border-b">
            <span className="text-gray-600 text-sm sm:text-base">Auction Set</span>
            <span className="font-semibold text-sm sm:text-base">
              {player.auctionSet?.name || "—"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 py-2 sm:py-3">
            {player.attributes.map((attr) => (
              <div
                key={attr.name}
                className="bg-blue-50 rounded-lg p-3 text-center"
              >
                <p className="text-xs text-gray-600 mb-1">{attr.displayName}</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                  {attr.defaultValue}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between py-2 sm:py-3 border-t">
            <span className="text-gray-600 text-sm sm:text-base">Acquired</span>
            <span className="text-xs sm:text-sm text-gray-500">
              {getTimeAgo(player.sold?.soldAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Team Section
const TeamSection = ({ team }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const segments = 11;
  const filledSegments = Math.floor(
    (team.spentBudget / (team.spentBudget + team.budget)) * segments
  );

  const getSegmentColor = (index) => {
    if (index < filledSegments) {
      const percentage = (index + 1) / segments;
      if (percentage <= 0.5) return "#10b981";
      if (percentage <= 0.75) return "#f59e0b";
      return "#ef4444";
    }
    return "#e5e7eb";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4 sm:mb-6">
      {/* Team Header */}
      <div
        className="p-4 sm:p-6 cursor-pointer border-l-4 sm:border-l-8"
        style={{ borderLeftColor: team.color }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
              <h2
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: team.color }}
              >
                {team.short}
              </h2>
              <span className="text-gray-600 text-sm sm:text-lg truncate">
                {team.name}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Budget</p>
                <p className="text-sm sm:text-xl font-bold">₹{team.budget}L</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Used</p>
                <p className="text-sm sm:text-xl font-bold text-orange-600">
                  ₹{team.spentBudget}L
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Players</p>
                <p className="text-sm sm:text-xl font-bold">
                  {team.players.length}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex gap-0.5 sm:gap-1 mb-2">
                {[...Array(segments)].map((_, i) => (
                  <div
                    key={i}
                    className="h-3 sm:h-4 flex-1 rounded-sm transition-all duration-300"
                    style={{ backgroundColor: getSegmentColor(i) }}
                  />
                ))}
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs text-gray-500">
                <span>
                  Progress:{" "}
                  {(
                    (team.spentBudget / (team.spentBudget + team.budget)) *
                    100
                  ).toFixed(1)}
                  %
                </span>
                <span>
                  Remaining: ₹
                  {(team.budget - team.spentBudget).toFixed(1)}L
                </span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <div
              className="text-xl sm:text-3xl transition-transform duration-300"
              style={{
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              ↑
            </div>
          </div>
        </div>
      </div>

      {/* Players Table */}
      {isExpanded && (
        <div className="border-t">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Set
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Time
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                    More
                  </th>
                </tr>
              </thead>
              <tbody>
                {team.players.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {p.name}
                    </td>
                    <td className="py-3 px-4 font-semibold text-green-600">
                      ₹{p.sold?.price}L
                    </td>
                    <td className="py-3 px-4">{p.auctionSet?.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {getTimeAgo(p.sold?.soldAt)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedPlayer(p)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg text-sm font-medium"
                      >
                        More
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {team.players.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              No players acquired yet.
            </div>
          )}
        </div>
      )}

      {selectedPlayer && (
        <PlayerModal
          player={selectedPlayer}
          team={team}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
};

// Main Component
const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:4000/auctionMeta/teams"); // 🔥 change URL to your backend
        setTeams(response.data.output);
        console.log(response)
      } catch (err) {
        console.error("Failed to fetch teams:", err);
        setError(err.message || "Failed to load teams");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Loading teams...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-lg">
        {error}
      </div>
    );

  const totalPlayers = teams.reduce(
    (sum, t) => sum + (t.players?.length || 0),
    0
  );
  const totalSpent = teams.reduce((sum, t) => sum + (t.spentBudget || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Auction Dashboard 2025
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Live Team & Player Overview
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-8 text-sm">
            <div className="bg-white rounded-lg px-4 sm:px-6 py-3 shadow">
              <p className="text-gray-500 text-xs sm:text-sm">Total Players</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">
                {totalPlayers}
              </p>
            </div>
            <div className="bg-white rounded-lg px-4 sm:px-6 py-3 shadow">
              <p className="text-gray-500 text-xs sm:text-sm">Total Spent</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                ₹{totalSpent.toFixed(1)}L
              </p>
            </div>
            <div className="bg-white rounded-lg px-4 sm:px-6 py-3 shadow">
              <p className="text-gray-500 text-xs sm:text-sm">Active Teams</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">
                {teams.length}
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-4 sm:space-y-6">
          {teams.map((team) => (
            <TeamSection key={team._id} team={team} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
