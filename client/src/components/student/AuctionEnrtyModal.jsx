import React, { useState } from "react";
import { dummyTeams } from "../../assets/assets";
import { Clock, Users, Trophy, DollarSign, Play, Eye } from "lucide-react";

// Dummy credentials
const dummyCredentials = {
  admin: "admin123",
  captains: {
    "Red Warriors": "red123",
    "Blue Titans": "blue123",
    "Green Gladiators": "green123",
    "Yellow Lightning": "yellow123",
  },
};

const AuctionEntryModal = ({ onSubmit }) => {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [team, setTeam] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    if (!role) {
      setError("Please select a role");
      return;
    }

    if (role === "audience") {
      if (!username) {
        setError("Please enter your username");
        return;
      }
      // Save to localStorage for 1 day
      localStorage.setItem(
        "auctionUser",
        JSON.stringify({
          role,
          username,
          expiry: new Date().getTime() + 24 * 60 * 60 * 1000,
        })
      );
      onSubmit({ role, username });
    } else if (role === "admin") {
      if (secretKey === dummyCredentials.admin) {
        localStorage.setItem(
          "auctionUser",
          JSON.stringify({
            role,
            username: "Admin",
            expiry: new Date().getTime() + 24 * 60 * 60 * 1000,
          })
        );
        onSubmit({ role, username: "Admin" });
      } else {
        setError("Invalid Admin Key");
      }
    } else if (role === "captain") {
      if (!team) {
        setError("Please select a team");
        return;
      }
      if (secretKey === dummyCredentials.captains[team]) {
        localStorage.setItem(
          "auctionUser",
          JSON.stringify({
            role,
            team,
            username: team + " Captain",
            expiry: new Date().getTime() + 24 * 60 * 60 * 1000,
          })
        );
        onSubmit({ role, team, username: team + " Captain" });
      } else {
        setError("Invalid Captain Key");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-8 w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Enter Auction</h2>
        <div className="space-y-3">
          <div>
            <label className="block mb-1 font-medium">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Select Role --</option>
              <option value="audience">Audience</option>
              <option value="captain">Captain</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {role === "audience" && (
            <div>
              <label className="block mb-1 font-medium">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          )}

          {role === "captain" && (
            <>
              <div>
                <label className="block mb-1 font-medium">Select Team</label>
                <select
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">-- Select Team --</option>
                  {dummyTeams.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Secret Key</label>
                <input
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </>
          )}

          {role === "admin" && (
            <div>
              <label className="block mb-1 font-medium">Secret Key</label>
              <input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          )}

          {error && <div className="text-red-500 font-medium">{error}</div>}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Enter Auction
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionEntryModal;
