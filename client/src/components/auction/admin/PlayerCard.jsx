import React from "react";

const PlayerCard = ({ player, sets, onRemove, onMove }) => {
  return (
    <div className="p-4 border rounded-lg shadow hover:shadow-md transition">
      <h4 className="font-semibold">{player.name}</h4>
      <p className="text-sm text-gray-500">
        {player.role} - {player.country}
      </p>
      <p className="text-sm">
        Bat: {player.batSkill} | Bowl: {player.bowlSkill}
      </p>
      <p className="text-sm">Base: ${player.basePrice}</p>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="mt-2 mr-2 px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
      >
        Remove
      </button>

      {/* Move Player Dropdown */}
      <select
        className="mt-2 px-2 py-1 text-xs border rounded"
        onChange={(e) => {
          if (e.target.value) onMove(e.target.value);
        }}
        defaultValue=""
      >
        <option value="" disabled>
          Move to Set...
        </option>
        {sets.map((s) =>
          s.id !== player.set ? (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ) : null
        )}
      </select>
    </div>
  );
};

export default PlayerCard;
