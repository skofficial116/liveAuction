import React, { useState } from "react";
import { dummyPlayers, dummyTeams } from "../../../assets/assets";

// Modal for Add/Edit Player
const PlayerModal = ({ isOpen, onClose, onSave, player, attributes, players }) => {
  // Create initial form data using the first player to infer types
  const initialFormData = player || attributes.reduce((acc, attr) => {
    const sampleValue = players[0]?.[attr];
    acc[attr] = sampleValue === undefined ? "" : (sampleValue === null ? "" : sampleValue);
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e, attr, type) => {
    let value = e.target.value;
    if (type === "number") value = Number(value);
    setFormData({ ...formData, [attr]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">{player ? "Edit Player" : "Add Player"}</h2>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {attributes.map((attr) => {
  const sampleValue = players[0]?.[attr];
  let inputType = "text";
  if (typeof sampleValue === "number") inputType = "number";
  if (attr.toLowerCase().includes("logo")) inputType = "file";

  // Check if this is the team field
  if (attr === "team") {
    return (
      <div key={attr} className="flex flex-col">
        <label className="font-medium">{attr}</label>
        <select
          value={formData[attr] || ""}
          onChange={(e) => handleChange(e, attr, "string")}
          className="border rounded px-3 py-2 mt-1 w-full"
        >
          <option value="" disabled hidden>Select Team</option>
          {dummyTeams.map((team) => (
            <option key={team.name} value={team.name}>
              {team.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div key={attr} className="flex flex-col">
      <label className="font-medium">{attr}</label>
      <input
        type={inputType}
        value={inputType === "file" ? undefined : formData[attr] || ""}
        onChange={(e) => handleChange(e, attr, typeof sampleValue)}
        className="border rounded px-3 py-2 mt-1 w-full"
      />
    </div>
  );
})}
        </div>
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Confirm Remove Modal
const ConfirmRemoveModal = ({ isOpen, onClose, onConfirm, playerName }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">Remove Player</h2>
        <p>Are you sure you want to remove <strong>{playerName}</strong>?</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

const ManagePlayersPage = () => {
  const defaultAttributes = ["id", "name", "role", "batSkill", "bowlSkill", "country", "basePrice", "soldPrice", "team", "set"];
  const [players, setPlayers] = useState(dummyPlayers);
  const [attributes, setAttributes] = useState(defaultAttributes);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [removePlayerId, setRemovePlayerId] = useState(null);

  // Add new attribute
  const handleAddAttribute = () => {
    const attrName = prompt("Enter new attribute name:");
    if (attrName && !attributes.includes(attrName)) {
      setAttributes([...attributes, attrName]);
      setPlayers(players.map(p => ({ ...p, [attrName]: null })));
    }
  };

  // Remove attribute
  const handleRemoveAttribute = (attr) => {
    if (window.confirm(`Remove attribute "${attr}"?`)) {
      setAttributes(attributes.filter(a => a !== attr));
      setPlayers(players.map(p => {
        const copy = { ...p };
        delete copy[attr];
        return copy;
      }));
    }
  };

  // Save player
  const handleSavePlayer = (playerData) => {
    if (editingPlayer) {
      setPlayers(players.map(p => (p.id === editingPlayer.id ? { ...editingPlayer, ...playerData } : p)));
    } else {
      setPlayers([...players, { ...playerData, id: Date.now() }]);
    }
  };

  // Confirm remove player
  const handleConfirmRemove = () => {
    setPlayers(players.filter(p => p.id !== removePlayerId));
    setRemovePlayerId(null);
  };

  return (
    <div className="px-5 md:px-16 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Manage Players</h1>

      {/* Attribute Management */}
      <div className="flex flex-wrap items-center gap-3">
        {attributes.map((attr) => (
          <div key={attr} className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded">
            <span className="capitalize">{attr}</span>
            {attr !== "id" && (
              <button onClick={() => handleRemoveAttribute(attr)} className="text-red-500 font-bold">&times;</button>
            )}
          </div>
        ))}
        <button
          onClick={handleAddAttribute}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          + Add Attribute
        </button>
      </div>

      {/* Player Cards */}
       <div>
        <button
          onClick={() => { setEditingPlayer(null); setIsModalOpen(true); }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Player
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {players.map((player) => (
          <div key={player.id} className="bg-white shadow rounded-lg p-4 flex flex-col space-y-2">
            {attributes.map(attr => (
              <p key={attr}><span className="font-semibold">{attr}:</span> {player[attr] ? player[attr] : <span className="text-red-500">N/A</span>    }</p>
            ))}
            <div className="mt-2 flex justify-between">
              <button
                onClick={() => { setEditingPlayer(player); setIsModalOpen(true); }}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => setRemovePlayerId(player.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Player Button */}
     

      {/* Modals */}
      <PlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePlayer}
        player={editingPlayer}
        attributes={attributes}
        players={players}
      />
      <ConfirmRemoveModal
        isOpen={!!removePlayerId}
        onClose={() => setRemovePlayerId(null)}
        onConfirm={handleConfirmRemove}
        playerName={players.find(p => p.id === removePlayerId)?.name}
      />
    </div>
  );
};

export default ManagePlayersPage;
