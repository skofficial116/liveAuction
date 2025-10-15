import React from 'react';
import { X } from 'lucide-react';

const PlayerForm = ({ player, attributes, index, onUpdateField, onUpdateAttribute, onRemove }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-gray-800">Player {index + 1}</h3>
        <button type="button" onClick={() => onRemove(player.id)} className="text-red-600 hover:text-red-800">
          <X size={18} />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Player Name</label>
          <input
            type="text"
            value={player.name}
            onChange={(e) => onUpdateField(player.id, 'name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Virat Kohli"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {attributes.map((attr) => (
            <div key={attr.id}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{attr.name}</label>
              {attr.type === 'select' ? (
                <select
                  value={player.attributes[attr.name] || attr.defaultValue}
                  onChange={(e) => onUpdateAttribute(player.id, attr.name, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select...</option>
                  <option value="Batsman">Batsman</option>
                  <option value="Bowler">Bowler</option>
                  <option value="All-Rounder">All-Rounder</option>
                  <option value="Wicket-Keeper">Wicket-Keeper</option>
                </select>
              ) : attr.type === 'int' ? (
                <input
                  type="number"
                  value={player.attributes[attr.name] || attr.defaultValue}
                  onChange={(e) => onUpdateAttribute(player.id, attr.name, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <input
                  type="text"
                  value={player.attributes[attr.name] || attr.defaultValue}
                  onChange={(e) => onUpdateAttribute(player.id, attr.name, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerForm;
