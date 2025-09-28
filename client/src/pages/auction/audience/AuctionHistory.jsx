import React, { useState } from "react";
import { dummyPlayers } from "../../../assets/assets";

const AuctionHistory = () => {
  const [activeTab, setActiveTab] = useState("All"); // All | Sold | Unsold
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

  const filteredPlayers = dummyPlayers.filter((player) => {
    if (activeTab === "Sold") return player.soldPrice !== null;
    if (activeTab === "Unsold") return player.soldPrice === null;
    return true;
  });

  // Sort the filtered players based on the current sortKey and sortOrder
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    if (!sortKey) return 0;

    let valA = a[sortKey];
    let valB = b[sortKey];

    // Handle null or undefined values by pushing them to the end
    if (valA === null || valA === undefined)
      valA = sortOrder === "asc" ? Infinity : -Infinity;
    if (valB === null || valB === undefined)
      valB = sortOrder === "asc" ? Infinity : -Infinity;

    // FIX: Check if BOTH values are strings before converting to lower case
    if (typeof valA === "string" && typeof valB === "string") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    // Comparison logic
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const sortableColumns = [
    "name",
    "batSkill",
    "bowlSkill",
    "country",
    "basePrice",
    "soldPrice",
    "team",
  ];

  return (
    <div className="px-7 md:px-20 py-10 bg-cyan-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Auction History / All Players
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 ">
        {["All", "Sold", "Unsold"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-full font-semibold ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Sorting Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {sortableColumns.map((key) => (
          <button
            key={key}
            onClick={() => handleSort(key)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              sortKey === key
                ? "bg-blue-600 text-white border-blue-600"
                : "text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
            {sortKey === key && (sortOrder === "asc" ? " ↑" : " ↓")}
          </button>
        ))}
      </div>

      {/* Player Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full table-auto">
          <tbody className="divide-y divide-gray-200">
            {sortedPlayers.map((player) => (
              <tr key={player.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                  {player.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {player.batSkill}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {player.bowlSkill}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {player.country}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  ${player.basePrice.toLocaleString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-semibold text-blue-600">
                  {player.soldPrice
                    ? `$${player.soldPrice.toLocaleString()}`
                    : "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {player.team || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuctionHistory;
