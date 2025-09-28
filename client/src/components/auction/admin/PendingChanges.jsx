import React from "react";

const PendingChanges = ({ changes, discardChange, applyChanges }) => {
  if (changes.length === 0) return null;

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg shadow space-y-3">
      <h3 className="font-bold text-yellow-800">Pending Changes</h3>
      <ul className="space-y-2 text-sm">
        {changes.map((change, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between bg-white border rounded px-3 py-2 shadow-sm"
          >
            <span>
              {change.type === "remove" && (
                <>
                  Remove <strong>{change.player.name}</strong> from{" "}
                  <strong>{change.fromSet}</strong>
                </>
              )}
              {change.type === "move" && (
                <>
                  Move <strong>{change.player.name}</strong> from{" "}
                  <strong>{change.fromSet}</strong> →{" "}
                  <strong>{change.toSet}</strong>
                </>
              )}
            </span>
            <button
              onClick={() => discardChange(idx)}
              className="ml-3 px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
            >
              Discard
            </button>
          </li>
        ))}
      </ul>

      <div className="flex justify-end">
        <button
          onClick={applyChanges}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          ✅ Save All Changes
        </button>
      </div>
    </div>
  );
};

export default PendingChanges;
