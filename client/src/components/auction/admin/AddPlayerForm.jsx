import React, { useState } from "react";

const AddPlayerForm = ({ selectedSet, setSets, setSelectedSet }) => {
  const [form, setForm] = useState({
    name: "",
    role: "",
    batSkill: "",
    bowlSkill: "",
    country: "",
    basePrice: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "batSkill" || name === "bowlSkill" || name === "basePrice"
        ? Number(value)
        : value,
    }));
  };

  const handleAddPlayer = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !selectedSet) return;

    const newPlayer = {
      id: Date.now(),
      ...form,
      soldPrice: null,
      team: null,
      set: selectedSet.id,
    };

    const updatedPlayers = [...selectedSet.players, newPlayer];

    // Update in sets
    setSets((prev) =>
      prev.map((s) =>
        s.id === selectedSet.id ? { ...s, players: updatedPlayers } : s
      )
    );

    // Update selectedSet
    setSelectedSet({ ...selectedSet, players: updatedPlayers });

    // Reset form
    setForm({
      name: "",
      role: "Batsman",
      batSkill: 50,
      bowlSkill: 50,
      country: "",
      basePrice: 100,
    });
  };

  return (
    <form
      onSubmit={handleAddPlayer}
      className="p-4 border rounded-lg bg-white shadow space-y-4"
    >
      <h4 className="font-semibold text-gray-700">Add Player to {selectedSet.name}</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Player Name"
          value={form.name}
          onChange={handleChange}
          className="px-3 py-2 border rounded"
          required
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="px-3 py-2 border rounded"
        >
          <option value="Batsman">Batsman</option>
          <option value="Bowler">Bowler</option>
          <option value="All-rounder">All-rounder</option>
          <option value="Wicketkeeper">Wicketkeeper</option>
        </select>

        <input
          type="number"
          name="batSkill"
          placeholder="Batting Skill"
          value={form.batSkill}
          onChange={handleChange}
          min="0"
          max="100"
          className="px-3 py-2 border rounded"
        />

        <input
          type="number"
          name="bowlSkill"
          placeholder="Bowling Skill"
          value={form.bowlSkill}
          onChange={handleChange}
          min="0"
          max="100"
          className="px-3 py-2 border rounded"
        />

        <input
          type="text"
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
          className="px-3 py-2 border rounded"
        />

        <input
          type="number"
          name="basePrice"
          placeholder="Base Price"
          value={form.basePrice}
          onChange={handleChange}
          min="0"
          step="10"
          className="px-3 py-2 border rounded"
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add Player
      </button>
    </form>
  );
};

export default AddPlayerForm;
