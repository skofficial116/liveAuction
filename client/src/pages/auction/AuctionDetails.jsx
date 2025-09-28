import React, { useState, useEffect } from "react";
import { Clock, Users, Trophy, DollarSign, Play, Eye } from "lucide-react";

// Dummy Teams / Assets
const dummyTeams = [
  { name: "Red Warriors", logo: "🔴" },
  { name: "Blue Titans", logo: "🔵" },
  { name: "Green Gladiators", logo: "🟢" },
  { name: "Yellow Lightning", logo: "🟡" },
];

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

// Auction Entry Modal
const AuctionEntryModal = ({ onSubmit, onClose }) => {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [team, setTeam] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    if (!role) return setError("Please select a role");

    if (role === "audience") {
      if (!username) return setError("Please enter your username");
      localStorage.setItem(
        "auctionUser",
        JSON.stringify({
          role,
          username,
          expiry: new Date().getTime() + 24 * 60 * 60 * 1000,
        })
      );
      onSubmit({ role, username });
      onClose();
      window.location.href = "/audience";
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
        onClose();
        window.location.href = "/admin";
      } else setError("Invalid Admin Key");
    } else if (role === "captain") {
      if (!team) return setError("Please select a team");
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
        onClose();
        window.location.href = "/captain";
      } else setError("Invalid Captain Key");
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

// Main AuctionDetails Component
const AuctionPage = () => {
  const sampleAuction = {
    name: "Premier Sports League Auction",
    description:
      "Get ready for the most thrilling live sports auction. Bid on your favorite players and manage your dream team in real-time!",
    startTime: new Date(new Date().getTime() + 5000), // starts in 5s
    endTime: new Date(new Date().getTime() + 7200 * 1000), // ends in 2h
    totalPlayers: 8,
    totalTeams: 4,
    teams: dummyTeams.map((team, i) => ({
      ...team,
      role: "Captain",
      budget: 500000,
      captain: ["John", "Jane", "Mike", "Sarah"][i] + " Doe",
    })),
  };

  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [auctionStatus, setAuctionStatus] = useState("not_started");

  // Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const startTime = sampleAuction.startTime.getTime();
      const endTime = sampleAuction.endTime.getTime();

      if (now < startTime) {
        const distance = startTime - now;
        setAuctionStatus("not_started");
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else if (now >= startTime && now < endTime) {
        const distance = endTime - now;
        setAuctionStatus("live");
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setAuctionStatus("ended");
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);

  const getStatusColor = () => {
    switch (auctionStatus) {
      case "not_started":
        return "bg-orange-500 hover:bg-orange-600";
      case "live":
        return "bg-red-500 hover:bg-red-600 animate-pulse";
      case "ended":
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (auctionStatus) {
      case "not_started":
        return "Starting Soon";
      case "live":
        return "Live";
      case "ended":
        return "Ended";
      default:
        return "Starting Soon";
    }
  };

  const getStatusIcon = () => {
    switch (auctionStatus) {
      case "not_started":
        return <Clock className="w-5 h-5" />;
      case "live":
        return <Play className="w-5 h-5" />;
      case "ended":
        return <Eye className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const handleStickyButtonClick = () => {
    if (auctionStatus === "not_started") return;
    setShowModal(true); // Trigger modal for role entry
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      {showModal && (
        <AuctionEntryModal
          onSubmit={() => {}}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header & Countdown */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {sampleAuction.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {sampleAuction.description}
          </p>

          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white text-center mt-6">
            <h2 className="text-2xl font-semibold mb-4">
              {auctionStatus === "not_started"
                ? "Starts In"
                : auctionStatus === "live"
                ? "Time Remaining"
                : "Auction Ended"}
            </h2>
            {auctionStatus !== "ended" ? (
              <div className="flex justify-center space-x-8">
                {timeLeft.days > 0 && (
                  <div className="text-center">
                    <div className="text-3xl font-bold">{timeLeft.days}</div>
                    <div className="text-sm opacity-75">Days</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-3xl font-bold">{timeLeft.hours}</div>
                  <div className="text-sm opacity-75">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{timeLeft.minutes}</div>
                  <div className="text-sm opacity-75">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{timeLeft.seconds}</div>
                  <div className="text-sm opacity-75">Seconds</div>
                </div>
              </div>
            ) : (
              <div className="text-2xl font-semibold">
                Thank you for participating!
              </div>
            )}
          </div>
        </div>

        {/* Teams Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Participating Teams
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleAuction.teams.map((team, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow text-center"
              >
                <div className="text-4xl mb-3">{team.logo}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {team.name}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center">
                    <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                    <span className="font-medium">
                      {formatCurrency(team.budget)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Captain:</span> {team.captain}
                  </div>
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {team.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Button */}
        <button
          onClick={handleStickyButtonClick}
          className={`fixed bottom-6 right-6 ${getStatusColor()} text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 z-50 ${
            auctionStatus === "not_started"
              ? "cursor-default"
              : "cursor-pointer"
          }`}
          disabled={auctionStatus === "not_started"}
        >
          {getStatusIcon()}
          <span className="font-semibold">{getStatusText()}</span>
        </button>
      </div>
    </div>
  );
};

export default AuctionPage;
