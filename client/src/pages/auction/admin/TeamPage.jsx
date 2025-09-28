import React, { useState } from "react";
import { dummyTeams, dummyPlayers } from "../../../assets/assets";
import { PlayerSoFar } from "../../../components/auction/PlayerSoFar";

const AdminTeamsPage = () => {
  const [teams, setTeams] = useState(dummyTeams);
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Modal States
  const [budgetModal, setBudgetModal] = useState({
    open: false,
    teamIndex: null,
    value: 0,
  });
  const [removeModal, setRemoveModal] = useState({
    open: false,
    teamIndex: null,
    playerId: null,
  });
  const [transferModal, setTransferModal] = useState({
    open: false,
    fromTeamIndex: null,
    playerId: null,
    targetTeamIndex: null,
  });

  // Sorting
  const handleSort = (key) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortPlayers = (players) => {
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

  // Admin Actions
  const openBudgetModal = (teamIndex, currentValue) => {
    setBudgetModal({ open: true, teamIndex, value: currentValue });
  };

  const saveBudget = () => {
    const updatedTeams = [...teams];
    updatedTeams[budgetModal.teamIndex].budgetLeft = parseInt(
      budgetModal.value,
      10
    );
    setTeams(updatedTeams);
    setBudgetModal({ open: false, teamIndex: null, value: 0 });
  };

  const openRemoveModal = (teamIndex, playerId) => {
    setRemoveModal({ open: true, teamIndex, playerId });
  };

  const openTransferModal = (fromTeamIndex, playerId) => {
    setTransferModal({
      open: true,
      fromTeamIndex,
      playerId,
      targetTeamIndex: null,
    });
  };
  // Remove Player
  const confirmRemove = () => {
    const updatedTeams = [...teams];
    const player = dummyPlayers.find((p) => p.id === removeModal.playerId);

    if (player) {
      // Add player price back to team budget
      updatedTeams[removeModal.teamIndex].budgetLeft += player.soldPrice || 0;

      // Remove player
      updatedTeams[removeModal.teamIndex].playersBought = updatedTeams[
        removeModal.teamIndex
      ].playersBought.filter((id) => id !== removeModal.playerId);
    }

    setTeams(updatedTeams);
    setRemoveModal({ open: false, teamIndex: null, playerId: null });
  };

  // Transfer Player
  const confirmTransfer = () => {
    const { fromTeamIndex, playerId, targetTeamIndex } = transferModal;
    if (targetTeamIndex === null) return;

    const updatedTeams = [...teams];
    const player = dummyPlayers.find((p) => p.id === playerId);

    if (player) {
      // Remove from source team & refund budget
      updatedTeams[fromTeamIndex].playersBought = updatedTeams[
        fromTeamIndex
      ].playersBought.filter((id) => id !== playerId);
      updatedTeams[fromTeamIndex].budgetLeft += player.soldPrice || 0;

      // Add to target team & deduct budget
      updatedTeams[targetTeamIndex].playersBought.push(playerId);
      updatedTeams[targetTeamIndex].budgetLeft -= player.soldPrice || 0;
    }

    setTeams(updatedTeams);
    setTransferModal({
      open: false,
      fromTeamIndex: null,
      playerId: null,
      targetTeamIndex: null,
    });
  };

  return (
    <div className="px-7 md:px-20 py-12 space-y-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
          Teams Overview (Admin)
        </h1>
        <p className="text-gray-500 mt-2">
          Track and manage all teams’ budget, players bought, and lineup during
          the auction.
        </p>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
        {teams.map((team, teamIndex) => {
          const totalSpent = team.playersBought.reduce((acc, playerId) => {
            const player = dummyPlayers.find((p) => p.id === playerId);
            return acc + (player?.soldPrice || 0);
          }, 0);
          const budgetSpentPercent =
            (totalSpent / (totalSpent + team.budgetLeft)) * 100;

          return (
            <div
              key={teamIndex}
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

                  {/* Admin Buttons */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      onClick={() =>
                        openBudgetModal(teamIndex, team.budgetLeft)
                      }
                    >
                      Adjust Budget
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{
                        width: `${budgetSpentPercent.toFixed(1)}%`,
                        backgroundColor:
                          budgetSpentPercent > 80
                            ? "#EF4444"
                            : budgetSpentPercent > 60
                            ? "#F97316"
                            : "#10B981",
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
                      <div
                        key={player.id}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <PlayerSoFar playerId={player.id} />
                        <div className="flex gap-2">
                          <button
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                            onClick={() =>
                              openRemoveModal(teamIndex, player.id)
                            }
                          >
                            Remove
                          </button>
                          <button
                            className="px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                            onClick={() =>
                              openTransferModal(teamIndex, player.id)
                            }
                          >
                            Transfer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Budget Modal */}
      {budgetModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
            <h2 className="text-xl font-bold">Adjust Budget</h2>
            <input
              type="range"
              min="0"
              max="10000"
              step="10"
              value={budgetModal.value}
              onChange={(e) =>
                setBudgetModal({ ...budgetModal, value: e.target.value })
              }
              className="w-full"
            />
            <input
              type="number"
              className="border rounded px-2 py-1 w-full"
              value={budgetModal.value}
              onChange={(e) =>
                setBudgetModal({ ...budgetModal, value: e.target.value })
              }
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() =>
                  setBudgetModal({ open: false, teamIndex: null, value: 0 })
                }
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={saveBudget}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Modal */}
      {removeModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
            <h2 className="text-lg font-semibold">Remove this player?</h2>
            <div className="flex justify-end gap-3">
              <button
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() =>
                  setRemoveModal({
                    open: false,
                    teamIndex: null,
                    playerId: null,
                  })
                }
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={confirmRemove}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {transferModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
            <h2 className="text-lg font-semibold">Transfer Player</h2>
            <p className="text-gray-600">
              Select a team to transfer this player to:
            </p>
            <select
              className="border rounded px-2 py-1 w-full"
              value={transferModal.targetTeamIndex ?? ""}
              onChange={(e) =>
                setTransferModal({
                  ...transferModal,
                  targetTeamIndex: parseInt(e.target.value, 10),
                })
              }
            >
              <option value="" disabled>
                Select team
              </option>
              {teams.map((t, idx) =>
                idx !== transferModal.fromTeamIndex ? (
                  <option key={idx} value={idx}>
                    {t.name}
                  </option>
                ) : null
              )}
            </select>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() =>
                  setTransferModal({
                    open: false,
                    fromTeamIndex: null,
                    playerId: null,
                    targetTeamIndex: null,
                  })
                }
              >
                Cancel
              </button>
              <button
                disabled={transferModal.targetTeamIndex === null}
                className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
                onClick={confirmTransfer}
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeamsPage;
