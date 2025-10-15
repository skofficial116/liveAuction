import { useState, useEffect } from "react";
import { ChevronLeft, Save, Plus, X, Users, FileText } from "lucide-react";
import ColorPicker from "./ColorPicker";
import axios from "axios";

const CreateAuction = ({
  editingAuctionId,
  auctions,
  setAuctions,
  hasUnsavedChanges,
  setHasUnsavedChanges,
  setEditingAuctionId,
  setCurrentPage,
  transformApiToAuctions,
}) => {
  const existingAuction = editingAuctionId
    ? auctions.find((a) => a.id === editingAuctionId)
    : null;

  const [formData, setFormData] = useState(
    existingAuction || {
      name: "",
      shortDesc: "",
      detailedDesc: "",
      startDate: "",
      timePerBid: 30,
      status: "draft",
      teams: [],
      attributes: [],
      players: [],
      auctionSets: [],
    }
  );

  const [activeTab, setActiveTab] = useState("basic");

  // Track form changes
  useEffect(() => {
    if (JSON.stringify(formData) !== JSON.stringify(existingAuction || {})) {
      setHasUnsavedChanges(true);
    }
  }, [formData, existingAuction]);

  const addTeam = () => {
    setFormData({
      ...formData,
      teams: [
        ...formData.teams,
        {
          id: Date.now(),
          name: "",
          short: "",
          budget: 100000000,
          color: "#4ECDC4",
          slogan: "",
          players: [],
        },
      ],
    });
  };

  const updateTeam = (id, field, value) => {
    setFormData({
      ...formData,
      teams: formData.teams.map((team) =>
        team.id === id ? { ...team, [field]: value } : team
      ),
    });
  };

  const removeTeam = (id) => {
    setFormData({
      ...formData,
      teams: formData.teams.filter((team) => team.id !== id),
    });
  };

  // 1️⃣ Add a new option to an attribute
  const addOptionToAttribute = (attrId) => {
    setFormData({
      ...formData,
      attributes: formData.attributes.map((attr) =>
        attr.id === attrId
          ? { ...attr, options: [...(attr.options || []), ""] } // initialize empty option
          : attr
      ),
    });
  };

  // 2️⃣ Update an option value
  const updateOptionInAttribute = (attrId, optionIndex, newValue) => {
    setFormData({
      ...formData,
      attributes: formData.attributes.map((attr) =>
        attr.id === attrId
          ? {
              ...attr,
              options: attr.options.map((opt, idx) =>
                idx === optionIndex ? newValue : opt
              ),
            }
          : attr
      ),
    });
  };

  // 3️⃣ Remove an option
  const removeOptionFromAttribute = (attrId, optionIndex) => {
    setFormData({
      ...formData,
      attributes: formData.attributes.map((attr) =>
        attr.id === attrId
          ? {
              ...attr,
              options: attr.options.filter((_, idx) => idx !== optionIndex),
            }
          : attr
      ),
    });
  };

  const addAttribute = () => {
    setFormData({
      ...formData,
      attributes: [
        ...formData.attributes,
        {
          id: Date.now(),
          name: "",
          isPrimary: false, // ✅ multiple can be true
          defaultValue: "",
          type: "string",
          options: [],
        },
      ],
    });
  };

  const updateAttribute = (id, field, value) => {
    setFormData({
      ...formData,
      attributes: formData.attributes.map((attr) =>
        attr.id === id ? { ...attr, [field]: value } : attr
      ),
    });
  };

  // const updateAttribute = (id, field, value) => {
  //   setFormData({
  //     ...formData,
  //     attributes: formData.attributes.map((attr) =>
  //       attr.id === id ? { ...attr, [field]: value } : attr
  //     ),
  //   });
  // };

  const removeAttribute = (id) => {
    setFormData({
      ...formData,
      attributes: formData.attributes.filter((attr) => attr.id !== id),
    });
  };

  const addPlayer = () => {
    const newPlayer = {
      id: Date.now(),
      name: "",
      attributes: {},
    };

    // Initialize player attributes with default values
    formData.attributes.forEach((attr) => {
      newPlayer.attributes[attr.name] = attr.defaultValue;
    });

    setFormData({
      ...formData,
      players: [...formData.players, newPlayer],
    });
  };

  const updatePlayer = (id, field, value) => {
    setFormData({
      ...formData,
      players: formData.players.map((player) =>
        player.id === id ? { ...player, [field]: value } : player
      ),
    });
  };

  const updatePlayerAttribute = (playerId, attrName, value) => {
    setFormData({
      ...formData,
      players: formData.players.map((player) =>
        player.id === playerId
          ? {
              ...player,
              attributes: { ...player.attributes, [attrName]: value },
            }
          : player
      ),
    });
  };

  const removePlayer = (id) => {
    setFormData({
      ...formData,
      players: formData.players.filter((player) => player.id !== id),
      auctionSets: formData.auctionSets.map((set) => ({
        ...set,
        players: set.players.filter((pId) => pId !== id),
      })),
    });
  };

  const addAuctionSet = () => {
    setFormData({
      ...formData,
      auctionSets: [
        ...formData.auctionSets,
        {
          id: Date.now(),
          name: "",
          players: [],
          order: "sequential",
        },
      ],
    });
  };

  const updateAuctionSet = (id, field, value) => {
    setFormData({
      ...formData,
      auctionSets: formData.auctionSets.map((set) =>
        set.id === id ? { ...set, [field]: value } : set
      ),
    });
  };

  const removeAuctionSet = (id) => {
    setFormData({
      ...formData,
      auctionSets: formData.auctionSets.filter((set) => set.id !== id),
    });
  };

  const randomizeSetOrder = (setId) => {
    setFormData({
      ...formData,
      auctionSets: formData.auctionSets.map((set) => {
        if (set.id === setId) {
          const shuffled = [...set.players].sort(() => Math.random() - 0.5);
          return { ...set, players: shuffled, order: "randomized" };
        }
        return set;
      }),
    });
  };

  const togglePlayerInSet = (setId, playerId) => {
    setFormData({
      ...formData,
      auctionSets: formData.auctionSets.map((set) => {
        if (set.id === setId) {
          const playerExists = set.players.includes(playerId);
          return {
            ...set,
            players: playerExists
              ? set.players.filter((id) => id !== playerId)
              : [...set.players, playerId],
          };
        } else {
          // Remove player from all other sets
          return {
            ...set,
            players: set.players.filter((id) => id !== playerId),
          };
        }
      }),
    });
  };

  useEffect(() => {
  const fetchAuctionForEdit = async () => {
    if (!editingAuctionId) return;

    try {
      const res = await fetch(`http://localhost:4000/auctionMeta/admin/${editingAuctionId}`);
      const data = await res.json();

      if (!data.success) {
        console.error("Failed to fetch auction data:", data.message);
        return;
      }

      // Transform backend data into frontend format
      const [formattedAuction] = transformApiToAuctions(data);

      // Populate the form
      setFormData({
        name: formattedAuction.name,
        shortDesc: formattedAuction.shortDesc,
        detailedDesc: formattedAuction.detailedDesc,
        startDate: formattedAuction.startDate,
        timePerBid: formattedAuction.timePerBid,
        basePrice: formattedAuction.basePrice || 0,
        status: formattedAuction.status || "draft",
        teams: formattedAuction.teams || [],
        attributes: formattedAuction.attributes || [],
        players: formattedAuction.players || [],
        auctionSets: formattedAuction.auctionSets || [],
      });

      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Error fetching auction for edit:", err);
    }
  };

  fetchAuctionForEdit();
}, [editingAuctionId]);


  const saveAuction = async () => {
    if (!formData.name) {
      alert("Please enter a name for the auction.");
      return;
    }

    // Prepare auction object for backend
    const newAuction = {
      name: formData.name,
      shortDesc: formData.shortDesc,
      detailedDesc: formData.detailedDesc,
      startDate: new Date(formData.startDate).toISOString(),
      timePerBid: formData.timePerBid,
      basePrice: formData.basePrice,
      status: formData.status,
      teams: formData.teams,
      attributes: formData.attributes.map((attr) => ({
        name: attr.name,
        displayName: attr.displayName,
        type: attr.type,
        defaultValue: attr.defaultValue,
        options: attr.options || [],
      })),
      players: formData.players.map((p) => ({
        name: p.name,
        basePrice: p.basePrice,
        attributes: Object.entries(p.attributes).map(([key, value]) => ({
          name: key,
          value,
        })),
      })),
      auctionSets: formData.auctionSets.map((set) => ({
        name: set.name,
        players: set.players,
        order: set.order || "sequential",
      })),
    };

    try {
      // Choose correct endpoint & method (create vs update)
      const url = "http://localhost:4000/auctionMeta/admin/createAuction";
      const method = "post";

      // Send auction to backend
      const response = await axios({
        method,
        url,
        data: newAuction,
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        alert("Auction saved successfully!");

        // ✅ Always re-fetch from API so dashboard reflects real backend data
        const res = await fetch("http://localhost:4000/auctionMeta/admin");
        const data = await res.json();

        // Transform backend data into frontend structure
        const formatted = transformApiToAuctions(data);

        // Update auctions state
        setAuctions(formatted);

        // Reset local editing state
        setEditingAuctionId(null);
        setHasUnsavedChanges(false);
        setCurrentPage("dashboard");
      } else {
        alert("Error: Backend did not return success.");
      }
    } catch (err) {
      console.error("Error saving auction:", err);
      alert("Failed to save auction. Check console for details.");
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        )
      ) {
        setHasUnsavedChanges(false);
        setEditingAuctionId(null);
        setCurrentPage("dashboard");
      }
    } else {
      setEditingAuctionId(null);
      setCurrentPage("dashboard");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft size={20} />
          Back to Dashboard
        </button>
        {hasUnsavedChanges && (
          <span className="text-orange-600 text-sm font-medium">
            Unsaved changes
          </span>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {editingAuctionId ? "Edit Auction" : "Create New Auction"}
        </h1>

        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-4 overflow-x-auto">
            {["basic", "teams", "attributes", "players", "sets"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === "basic" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Auction Name/Title *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., IPL Player Auction 2025"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <input
                type="text"
                value={formData.shortDesc}
                onChange={(e) =>
                  setFormData({ ...formData, shortDesc: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Description
              </label>
              <textarea
                value={formData.detailedDesc}
                onChange={(e) =>
                  setFormData({ ...formData, detailedDesc: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detailed description of the auction"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time per Bid (seconds)
                </label>
                <input
                  type="number"
                  value={formData.timePerBid}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      timePerBid: parseInt(e.target.value) || 30,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="10"
                  max="300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Price ( for All )
                </label>
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      basePrice: parseInt(e.target.value) || 30,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "teams" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Teams ({formData.teams.length})
              </h2>
              <button
                type="button"
                onClick={addTeam}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus size={18} />
                Add Team
              </button>
            </div>

            {formData.teams.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Users size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">
                  No teams added yet. Click Add Team to get started.
                </p>
              </div>
            )}

            <div className="space-y-4">
              {formData.teams.map((team, index) => (
                <div
                  key={team.id}
                  className="border border-gray-200 rounded-lg p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-800">
                      Team {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeTeam(team.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Team Name
                      </label>
                      <input
                        type="text"
                        value={team.name}
                        onChange={(e) =>
                          updateTeam(team.id, "name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Mumbai Indians"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        shorteviation (2-3 letters)
                      </label>
                      <input
                        type="text"
                        value={team.short}
                        onChange={(e) =>
                          updateTeam(
                            team.id,
                            "short",
                            e.target.value.toUpperCase()
                          )
                        }
                        maxLength={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="MI"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Initial Budget
                      </label>
                      <input
                        type="number"
                        value={team.budget}
                        onChange={(e) =>
                          updateTeam(
                            team.id,
                            "budget",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Team Color
                      </label>
                      <ColorPicker
                        value={team.color}
                        onChange={(color) =>
                          updateTeam(team.id, "color", color)
                        }
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Slogan
                      </label>
                      <input
                        type="text"
                        value={team.slogan}
                        onChange={(e) =>
                          updateTeam(team.id, "slogan", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Team slogan"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "attributes" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Player Attributes ({formData.attributes.length})
              </h2>
              <button
                type="button"
                onClick={addAttribute}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus size={18} />
                Add Attribute
              </button>
            </div>

            {formData.attributes.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FileText size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">
                  No attributes defined yet. Click Add Attribute to create
                  player properties.
                </p>
              </div>
            )}

            <div className="space-y-3">
              {formData.attributes.map((attr, index) => (
                <div
                  key={attr.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-800">
                      Attribute {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeAttribute(attr.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Attribute Name
                      </label>
                      <input
                        type="text"
                        value={attr.name}
                        onChange={(e) =>
                          updateAttribute(attr.id, "name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Role"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Type
                      </label>
                      <select
                        value={attr.type}
                        onChange={(e) =>
                          updateAttribute(attr.id, "type", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="string">String</option>
                        <option value="int">Integer</option>
                        <option value="select">Select</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Default Value
                      </label>
                      <input
                        type="text"
                        value={attr.defaultValue}
                        onChange={(e) =>
                          updateAttribute(
                            attr.id,
                            "defaultValue",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-end">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={attr.isPrimary}
                          onChange={(e) =>
                            updateAttribute(
                              attr.id,
                              "isPrimary",
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          Is Primary
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Options section for 'select' type */}
                  {attr.type === "select" && (
                    <div className="mt-3 space-y-2">
                      <label className="block text-xs font-medium text-gray-600">
                        Options
                      </label>

                      <div className="space-y-1">
                        {attr.options.map((opt, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) =>
                                updateOptionInAttribute(
                                  attr.id,
                                  idx,
                                  e.target.value
                                )
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                              placeholder="Option value"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeOptionFromAttribute(attr.id, idx)
                              }
                              className="text-red-600 hover:text-red-800"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => addOptionToAttribute(attr.id)}
                        className="mt-1 text-blue-600 text-sm hover:underline flex items-center gap-1"
                      >
                        <Plus size={14} /> Add Option
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "players" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Players ({formData.players.length})
              </h2>
              <button
                type="button"
                onClick={addPlayer}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus size={18} />
                Add Player
              </button>
            </div>

            {formData.attributes.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  Please add attributes first before adding players.
                </p>
              </div>
            )}

            {formData.players.length === 0 &&
              formData.attributes.length > 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Users size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600">
                    No players added yet. Click Add Player to get started.
                  </p>
                </div>
              )}

            <div className="space-y-3">
              {formData.players.map((player, index) => (
                <div
                  key={player.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-800">
                      Player {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removePlayer(player.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* Player Name */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Player Name
                      </label>
                      <input
                        type="text"
                        value={player.name}
                        onChange={(e) =>
                          updatePlayer(player.id, "name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Virat Kohli"
                      />
                    </div>

                    {/* Player Attributes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {formData.attributes.map((attr) => (
                        <div key={attr.id}>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            {attr.name}
                          </label>

                          {/* Dynamic input based on type */}
                          {attr.type === "select" ? (
                            <select
                              value={
                                player.attributes[attr.name] !== undefined
                                  ? player.attributes[attr.name]
                                  : attr.defaultValue
                              }
                              onChange={(e) =>
                                updatePlayerAttribute(
                                  player.id,
                                  attr.name,
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select...</option>
                              {attr.options.map((opt, idx) => (
                                <option key={idx} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : attr.type === "int" ? (
                            <input
                              type="number"
                              value={
                                player.attributes[attr.name] ||
                                attr.defaultValue
                              }
                              onChange={(e) =>
                                updatePlayerAttribute(
                                  player.id,
                                  attr.name,
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <input
                              type="text"
                              value={
                                player.attributes[attr.name] ||
                                attr.defaultValue
                              }
                              onChange={(e) =>
                                updatePlayerAttribute(
                                  player.id,
                                  attr.name,
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "sets" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Auction Sets ({formData.auctionSets.length})
              </h2>
              <button
                type="button"
                onClick={addAuctionSet}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus size={18} />
                Add Auction Set
              </button>
            </div>

            {formData.players.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  Please add players first before creating auction sets.
                </p>
              </div>
            )}

            {formData.auctionSets.length === 0 &&
              formData.players.length > 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FileText size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600">
                    No auction sets created yet. Click Add Auction Set to
                    organize players.
                  </p>
                </div>
              )}

            <div className="space-y-4">
              {formData.auctionSets.map((set, index) => (
                <div
                  key={set.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-800">
                      Set {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeAuctionSet(set.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Set Name
                      </label>
                      <input
                        type="text"
                        value={set.name}
                        onChange={(e) =>
                          updateAuctionSet(set.id, "name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Marquee Players"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Select Players
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded p-3">
                        {formData.players.map((player) => {
                          const inCurrentSet = set.players.includes(player.id);
                          const inOtherSet = formData.auctionSets.some(
                            (s) =>
                              s.id !== set.id && s.players.includes(player.id)
                          );

                          const bgClass = inCurrentSet
                            ? "bg-green-100" // current set → green highlight
                            : inOtherSet
                            ? "bg-yellow-100" // other set → yellow highlight
                            : "bg-white"; // not selected → default

                          return (
                            <label
                              key={player.id}
                              className={`flex items-center gap-2 p-2 rounded cursor-pointer ${bgClass} hover:bg-gray-50 transition-colors`}
                            >
                              <input
                                type="checkbox"
                                checked={inCurrentSet}
                                onChange={() =>
                                  togglePlayerInSet(set.id, player.id)
                                }
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">
                                {player.name ||
                                  `Player ${
                                    formData.players.indexOf(player) + 1
                                  }`}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateAuctionSet(set.id, "order", "sequential")
                        }
                        className={`px-4 py-2 rounded transition-colors ${
                          set.order === "sequential"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Sequential Order
                      </button>
                      <button
                        type="button"
                        onClick={() => randomizeSetOrder(set.id)}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                      >
                        Randomize Order
                      </button>
                    </div>

                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Selected Players ({set.players.length}):
                      </p>
                      {set.players.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {set.players.map((playerId, idx) => {
                            const player = formData.players.find(
                              (p) => p.id === playerId
                            );
                            return player ? (
                              <span
                                key={playerId}
                                className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border border-gray-200 flex items-center gap-2"
                              >
                                <span className="text-xs font-semibold text-gray-500">
                                  #{idx + 1}
                                </span>
                                {player.name ||
                                  `Player ${
                                    formData.players.indexOf(player) + 1
                                  }`}
                              </span>
                            ) : null;
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No players selected
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={saveAuction}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save size={20} />
            {editingAuctionId ? "Update Auction" : "Save Auction"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAuction;
