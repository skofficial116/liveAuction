import React from 'react';
import { X } from 'lucide-react';

const AuctionSetForm = ({ set, index, players, onUpdate, onTogglePlayer, onRemove, onRandomize }) => {
  const updateField = (field, value) => onUpdate(set.id, field, value);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-gray-800">Set {index + 1}</h3>
        <button type="button" onClick={() => onRemove(set.id)} className="text-red-600 hover:text-red-800">
          <X size={18} />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Set Name</label>
          <input
            type="text"
            value={set.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Marquee Players"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">Select Players</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded p-3">
            {players.map((player) => (
              <label key={player.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={set.players.includes(player.id)}
                  onChange={() => onTogglePlayer(set.id, player.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{player.name || `Player ${players.indexOf(player) + 1}`}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => updateField('order', 'sequential')}
            className={`px-4 py-2 rounded transition-colors ${set.order === 'sequential' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Sequential Order
          </button>
          <button
            type="button"
            onClick={() => onRandomize(set.id)}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Randomize Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionSetForm;
