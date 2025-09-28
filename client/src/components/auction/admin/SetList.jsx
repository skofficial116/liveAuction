import React, { useState } from "react";
import SetCard from "./SetCard";

const SetList = ({ sets, selectedSet, setSelectedSet, setSets }) => {
  const [newSetName, setNewSetName] = useState("");

  const handleRemove = (id) => {
    if (window.confirm("Remove this set?")) {
      setSets(prev => prev.filter(s => s.id !== id));
      if (selectedSet?.id === id) setSelectedSet(null);
    }
  };

  const handleAddSet = () => {
    if (!newSetName.trim()) return;
    const newSet = {
      id: Date.now().toString(),
      name: newSetName,
      players: [],
    };
    setSets(prev => [...prev, newSet]);
    setNewSetName("");
  };

  const handleRenameSet = (id, newName) => {
    setSets(prev =>
      prev.map(s => s.id === id ? { ...s, name: newName } : s)
    );
    if (selectedSet?.id === id) {
      setSelectedSet({ ...selectedSet, name: newName });
    }
  };

  return (
    <div className="space-y-4">
      {/* Existing Sets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sets.map((set) => (
          <SetCard
            key={set.id}
            setData={set}
            isSelected={selectedSet?.id === set.id}
            onSelect={() => setSelectedSet(set)}
            onRemove={() => handleRemove(set.id)}
            onRename={(newName) => handleRenameSet(set.id, newName)}
          />
        ))}
      </div>

      {/* Add New Set */}
      <div className="flex gap-2 items-center mt-4">
        <input
          type="text"
          placeholder="Enter new set name"
          value={newSetName}
          onChange={(e) => setNewSetName(e.target.value)}
          className="px-3 py-2 border rounded w-full md:w-1/3"
        />
        <button
          onClick={handleAddSet}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Set
        </button>
      </div>
    </div>
  );
};

export default SetList;
