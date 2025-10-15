import React from 'react';
import { X } from 'lucide-react';
import ColorPicker from './ColorPicker';

const TeamForm = ({ team, index, onUpdate, onRemove }) => {
  const updateField = (field, value) => onUpdate(team.id, field, value);

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-800">Team {index + 1}</h3>
        <button type="button" onClick={() => onRemove(team.id)} className="text-red-600 hover:text-red-800">
          <X size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Team Name</label>
          <input
            type="text"
            value={team.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Mumbai Indians"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Abbreviation (2-3 letters)</label>
          <input
            type="text"
            value={team.short}
            onChange={(e) => updateField('short', e.target.value.toUpperCase())}
            maxLength={3}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            placeholder="MI"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Initial Budget</label>
          <input
            type="number"
            value={team.budget}
            onChange={(e) => updateField('budget', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Team Color</label>
          <ColorPicker value={team.color} onChange={(color) => updateField('color', color)} />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Slogan</label>
          <input
            type="text"
            value={team.slogan}
            onChange={(e) => updateField('slogan', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Team slogan"
          />
        </div>
      </div>
    </div>
  );
};

export default TeamForm;
