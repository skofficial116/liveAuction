import React, { useState, useMemo } from "react";
import { dummyPlayers } from "../../../assets/assets";
import SetList from "../../../components/auction/admin/SetList";
import PlayerList from "../../../components/auction/admin/PlayerList";
import SetStats from "../../../components/auction/admin/SetStats";
import SearchFilter from "../../../components/auction/admin/SearchFilter";
import RandomizeButton from "../../../components/auction/admin/RandomizeButton";
import AddPlayerForm from "../../../components/auction/admin/AddPlayerForm";
import PendingChanges from "../../../components/auction/admin/PendingChanges";

const ManageSetsPage = () => {
  const [sets, setSets] = useState([
    {
      id: "A",
      name: "Set A",
      players: dummyPlayers.filter((p) => p.set === "A"),
    },
    {
      id: "B",
      name: "Set B",
      players: dummyPlayers.filter((p) => p.set === "B"),
    },
    {
      id: "C",
      name: "Set C",
      players: dummyPlayers.filter((p) => p.set === "C"),
    },
  ]);

  const [selectedSet, setSelectedSet] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showAddPlayer, setShowAddPlayer] = useState(false);

  const [pendingChanges, setPendingChanges] = useState([]);

  // --- Filters
  const filteredPlayers = useMemo(() => {
    if (!selectedSet) return [];
    return selectedSet.players.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "All" || p.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [selectedSet, search, roleFilter]);

  // --- Randomize
  const handleRandomize = () => {
    if (!selectedSet) return;
    const randomized = [...selectedSet.players].sort(() => Math.random() - 0.5);
    setSets((prev) =>
      prev.map((s) =>
        s.id === selectedSet.id ? { ...s, players: randomized } : s
      )
    );
    setSelectedSet({ ...selectedSet, players: randomized });
  };

  // --- Pending Changes
  const addPendingChange = (change) => {
    setPendingChanges((prev) => [...prev, change]);
  };

  const discardChange = (index) => {
    setPendingChanges((prev) => prev.filter((_, i) => i !== index));
  };

  const applyChanges = () => {
    let newSets = [...sets];

    pendingChanges.forEach((change) => {
      if (change.type === "remove") {
        newSets = newSets.map((s) =>
          s.id === change.fromSet
            ? {
                ...s,
                players: s.players.filter((p) => p.id !== change.player.id),
              }
            : s
        );
      }

      if (change.type === "move") {
        newSets = newSets.map((s) => {
          if (s.id === change.fromSet) {
            return {
              ...s,
              players: s.players.filter((p) => p.id !== change.player.id),
            };
          }
          if (s.id === change.toSet) {
            return {
              ...s,
              players: [...s.players, { ...change.player, set: change.toSet }],
            };
          }
          return s;
        });
      }
    });

    setSets(newSets);
    setSelectedSet(newSets.find((s) => s.id === selectedSet.id) || null);
    setPendingChanges([]); // clear after saving
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Manage Sets</h2>

      <SetList
        sets={sets}
        selectedSet={selectedSet}
        setSelectedSet={setSelectedSet}
        setSets={setSets}
      />

      {/* Pending Changes */}
      <PendingChanges
        changes={pendingChanges}
        discardChange={discardChange}
        applyChanges={applyChanges}
      />

      {selectedSet && (
        <div className="space-y-6">
          <div>
            <button
              onClick={() => setShowAddPlayer(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              + Add Player
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <SetStats players={selectedSet.players} />
            <RandomizeButton onClick={handleRandomize} />
          </div>

          <SearchFilter
            search={search}
            setSearch={setSearch}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
          />

          <PlayerList
            players={filteredPlayers}
            sets={sets}
            addPendingChange={addPendingChange}
          />

          {showAddPlayer && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
                <button
                  onClick={() => setShowAddPlayer(false)}
                  className="absolute top-3 right-3 text-red-500 font-bold text-lg"
                >
                  ✕
                </button>
                <AddPlayerForm
                  selectedSet={selectedSet}
                  setSets={setSets}
                  setSelectedSet={setSelectedSet}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageSetsPage;
