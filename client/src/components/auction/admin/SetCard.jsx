import React, { useState } from "react";

const SetCard = ({ setData, isSelected, onSelect, onRemove, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(setData.name);

  const handleSave = () => {
    if (tempName.trim()) {
      onRename(tempName);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition 
      ${isSelected ? "border-blue-600 bg-blue-50" : "border-gray-200"}`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-center">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
              autoFocus
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className="text-green-600 text-sm"
            >
              Save
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(false);
                setTempName(setData.name);
              }}
              className="text-gray-500 text-sm"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-semibold text-lg">{setData.name}</h3>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="text-blue-600 hover:underline text-sm"
              >
                Rename
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          </>
        )}
      </div>
      <p className="text-sm text-gray-600">{setData.players.length} players</p>
    </div>
  );
};

export default SetCard;
