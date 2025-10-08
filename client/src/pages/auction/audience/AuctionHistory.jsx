import React, { useState, useEffect } from "react";
import { Eye, X, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import axios from "axios";

// ✅ Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case "Sold":
        return "bg-green-100 text-green-800";
      case "Unsold":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle()}`}
    >
      {status}
    </span>
  );
};

// ✅ Player Modal Component
const PlayerModal = ({ player, onClose }) => {
  if (!player) return null;

  const odRating =
    player.attributes?.find((a) => a.name === "odRating")?.defaultValue ?? "-";
  const t20Rating =
    player.attributes?.find((a) => a.name === "t20Rating")?.defaultValue ?? "-";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{player.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Auction Set</p>
              <p className="text-lg font-semibold text-gray-800">
                {player.auctionSet.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Base Price</p>
              <p className="text-lg font-semibold text-gray-800">
                ₹ {player.basePrice} L
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">ODI Rating</p>
              <p className="text-lg font-semibold text-blue-600">
                {odRating}/100
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">T20 Rating</p>
              <p className="text-lg font-semibold text-purple-600">
                {t20Rating}/100
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 font-medium mb-2">Status</p>
            <StatusBadge status={player.statusText} />
          </div>

          {player.statusText === "Sold" && (
            <>
              <div>
                <p className="text-sm text-gray-500 font-medium">Team</p>
                <p className="text-xl font-bold text-indigo-600">
                  { player.sold.team.name||player.teamName ||"-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Price</p>
                <p className="text-xl font-bold text-green-600">
                  ₹ {player.sold.price} L
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ Sortable Header
const SortableHeader = ({
  label,
  sortKey,
  currentSort,
  onSort,
  hideOn = "",
}) => {
  const isActive = currentSort.key === sortKey;
  const getSortIcon = () => {
    if (!isActive) return <ArrowUpDown size={14} />;
    return currentSort.direction === "asc" ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

  return (
    <th className={`py-3 px-4 font-semibold text-sm ${hideOn}`}>
      <button
        onClick={() => onSort(sortKey)}
        className="flex items-center gap-2 hover:text-indigo-200 transition-colors"
      >
        <span>{label}</span>
        <span className={isActive ? "text-indigo-200" : "text-indigo-300"}>
          {getSortIcon()}
        </span>
      </button>
    </th>
  );
};

// ✅ Player Table
const PlayerTable = ({ players, onViewDetails, sortConfig, onSort }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-indigo-600 text-white">
          <SortableHeader
            label="Name"
            sortKey="name"
            currentSort={sortConfig}
            onSort={onSort}
          />
          <SortableHeader
            label="Set"
            sortKey="auctionSet"
            currentSort={sortConfig}
            onSort={onSort}
            hideOn="hidden lg:table-cell"
          />
          <SortableHeader
            label="OD"
            sortKey="odRating"
            currentSort={sortConfig}
            onSort={onSort}
            hideOn="hidden md:table-cell"
          />
          <SortableHeader
            label="T20"
            sortKey="t20Rating"
            currentSort={sortConfig}
            onSort={onSort}
            hideOn="hidden md:table-cell"
          />
          <SortableHeader
            label="Base Price"
            sortKey="basePrice"
            currentSort={sortConfig}
            onSort={onSort}
            hideOn="hidden xl:table-cell"
          />
          <SortableHeader
            label="Status"
            sortKey="status"
            currentSort={sortConfig}
            onSort={onSort}
          />
          <SortableHeader
            label="Team"
            sortKey="teamName"
            currentSort={sortConfig}
            onSort={onSort}
            hideOn="hidden xl:table-cell"
          />
          <SortableHeader
            label="Price"
            sortKey="soldPrice"
            currentSort={sortConfig}
            onSort={onSort}
            hideOn="hidden xl:table-cell"
          />
          <th className="py-3 px-4 text-center font-semibold text-sm">More</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player, index) => {
          const od =
            player.attributes?.find((a) => a.name === "odRating")
              ?.defaultValue ?? "-";
          const t20 =
            player.attributes?.find((a) => a.name === "t20Rating")
              ?.defaultValue ?? "-";

          return (
            <tr
              key={player._id}
              className={`border-b hover:bg-gray-50 transition-colors ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="py-3 px-4 font-medium text-gray-800">
                {player.name}
              </td>
              <td className="py-3 px-4 text-center hidden lg:table-cell">
                {player.auctionSet.name}
              </td>
              <td className="py-3 px-4 text-center hidden md:table-cell text-blue-600 font-semibold">
                {od}
              </td>
              <td className="py-3 px-4 text-center hidden md:table-cell text-purple-600 font-semibold">
                {t20}
              </td>
              <td className="py-3 px-4 text-center hidden xl:table-cell">
                ₹ {player.basePrice}
              </td>
              <td className="py-3 px-4 text-center">
                <StatusBadge status={player.statusText} />
              </td>
              <td className="py-3 px-4 text-center hidden xl:table-cell">
                {player.teamName || "-"}
              </td>
              <td className="py-3 px-4 text-center hidden xl:table-cell">
                {player.statusText === "Sold" ? `₹ ${player.sold.price}` : "-"}
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => onViewDetails(player)}
                  className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md transition-colors text-sm font-medium"
                >
                  <Eye size={16} />
                  <span>More</span>
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

// ✅ Main Component
const AuctionHistory = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Fetch players from backend
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/auctionMeta/players"
        );
        // setPlayers(res.data.players || []);
        if (res.data.success) {
          const processed = res.data.players.map((p) => ({
            ...p,
            statusText: p.sold?.isSold
              ? "Sold"
              : p.sold
              ? "Unsold"
              : "Yet to Auction",
            teamName: p.sold?.teamName || "-", // optional team name lookup
            soldPrice: p.sold?.price ?? 0,
            odRating:
              p.attributes?.find((a) => a.name === "odRating")?.defaultValue ??
              0,
            t20Rating:
              p.attributes?.find((a) => a.name === "t20Rating")?.defaultValue ??
              0,
          }));
          console.log(processed);
          setPlayers(processed);
        }
      } catch (err) {
        console.error("Error fetching players:", err);
      }
    };
    fetchPlayers();
  }, []);

  // Sorting logic (✅ includes Status column)
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, direction: "asc" };
      return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
    });
  };

  const sortedPlayers = [...players].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // ✅ Handle status sorting manually
    if (sortConfig.key === "status") {
      aValue = a.statusText;
      bValue = b.statusText;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Auction So Far
          </h1>
          <p className="text-gray-600">Preview of the Auction so far</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-800">
                {sortedPlayers.length}
              </span>{" "}
              players
            </p>
          </div>

          <PlayerTable
            players={sortedPlayers}
            onViewDetails={setSelectedPlayer}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        </div>

        {selectedPlayer && (
          <PlayerModal
            player={selectedPlayer}
            onClose={() => setSelectedPlayer(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AuctionHistory;
