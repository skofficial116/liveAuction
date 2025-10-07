import React, { useState, useEffect } from "react";
import { dummyTeams, currentPlayer } from "../../../assets/assets";
import { AppContext } from "../../../context/AppContext";

// -------------------- AUCTION TIMER --------------------
const AuctionTimer = ({ endTime, isPaused, onTimeEnd }) => {
  const [timeLeft, setTimeLeft] = useState(
    Math.max(Math.floor((new Date(endTime) - new Date()) / 1000), 0)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onTimeEnd();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, endTime, onTimeEnd]);

  useEffect(() => {
    setTimeLeft(Math.max(Math.floor((new Date(endTime) - new Date()) / 1000), 0));
  }, [endTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="flex items-center justify-center space-x-4 text-lg font-bold text-blue-600">
      <span>{timeLeft > 0 ? `Time left: ${formatTime(timeLeft)}` : "Ended"}</span>
    </div>
  );
};

// -------------------- CURRENT PLAYER CARD --------------------
const CurrentPlayerCard = ({ player, highestBid }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 text-center space-y-4">
    <h2 className="text-2xl font-bold">{player.name}</h2>
    <p className="text-gray-600">{player.fact}</p>
    <p className="text-gray-500">Base Price: ${player.basePrice}K</p>

    {highestBid ? (
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-700">
          Current Highest Bid
        </h3>
        <p className="text-3xl font-bold text-blue-900">${highestBid.amount}K</p>
        <div className="flex items-center justify-center mt-2 space-x-2">
          <img
            src={highestBid.teamLogo}
            alt={highestBid.team}
            className="w-8 h-8 object-contain"
          />
          <span className="text-gray-800 font-semibold">{highestBid.team}</span>
        </div>
      </div>
    ) : (
      <p className="text-gray-500 italic">No bids yet</p>
    )}

    <div className="text-sm text-gray-700 space-y-1">
      <p>Bat Skill: {player.batSkill}</p>
      <p>Bowl Skill: {player.bowlSkill}</p>
    </div>
  </div>
);

// -------------------- BID HISTORY --------------------
const BidHistory = ({ bids }) => (
  <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
    <h3 className="text-lg font-semibold">Bid History</h3>
    <ul className="text-gray-700 text-sm space-y-1">
      {bids.map((bid, idx) => (
        <li key={idx}>
          <strong>{bid.team}</strong> → ${bid.amount}K
        </li>
      ))}
    </ul>
  </div>
);

// -------------------- TEAM BUDGETS --------------------
const TeamBudgets = ({ dummyTeams }) => (
  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
    {dummyTeams.map((team, idx) => (
      <div
        key={idx}
        className="bg-white p-4 rounded-lg shadow-md text-center space-y-2"
      >
        <img src={team.logo} className="w-12 h-12 object-contain mx-auto" />
        <h4 className="font-bold">{team.name}</h4>
        <p className="text-sm text-gray-600">
          Budget Left: ${team.budgetLeft}K
        </p>
        <p className="text-sm text-gray-500">
          Players: {team.playersBought.length}
        </p>
      </div>
    ))}
  </div>
);

// -------------------- NOTIFICATIONS --------------------
const Notifications = ({ messages, onApprove, onReject }) => (
  <div className="bg-gray-100 p-3 rounded-lg h-60 overflow-y-auto space-y-2">
    {messages.map((msg) => (
      <div
        key={msg.id}
        className={`bg-white p-2 rounded shadow flex flex-col space-y-1 ${
          msg.status === "approved"
            ? "border-l-4 border-green-500"
            : msg.status === "rejected"
            ? "border-l-4 border-red-500"
            : ""
        }`}
      >
        <p className="text-sm text-gray-700">🔔 {msg.text}</p>
        {msg.type === "moreTime" && msg.status === "pending" && (
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => onApprove(msg.id)}
              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(msg.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
            >
              Reject
            </button>
          </div>
        )}
        {msg.status && msg.status !== "pending" && (
          <p className="text-xs font-semibold text-gray-500">
            Status: {msg.status.toUpperCase()}
          </p>
        )}
      </div>
    ))}
  </div>
);

// -------------------- BID MODAL --------------------
const BidModal = ({ highestBid, onRestart, onModify, onClose }) => {
  const [newAmount, setNewAmount] = useState(highestBid.amount);
  const [newTeam, setNewTeam] = useState(highestBid.team);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 space-y-4">
        <h2 className="text-xl font-bold">Bid Ended</h2>
        <p>
          Current highest bid: <strong>${highestBid.amount}K</strong> by{" "}
          <strong>{highestBid.team}</strong>
        </p>
        <div className="flex flex-col space-y-2">
          <button
            onClick={onRestart}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Restart with Increased Time
          </button>
          <div className="space-y-1">
            <input
              type="text"
              placeholder="Team Name"
            //   value={newTeam}
              onChange={(e) => setNewTeam(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
            <input
              type="number"
              placeholder="Bid Amount"
              value={newAmount === 0 ? '' : newAmount}
              onChange={(e) => setNewAmount(Number(e.target.value))}
              className="w-full border px-2 py-1 rounded"
            />
            <button
              onClick={() => onModify(newTeam, newAmount)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              Modify and Submit Bid
            </button>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-2 text-sm text-gray-500 hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// -------------------- MAIN ADMIN CURRENT BID --------------------
const AdminCurrentBid = () => {
  const [endTime, setEndTime] = useState(new Date(Date.now() + 1 * 10 * 1000));
  const [isPaused, setIsPaused] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [bids, setBids] = useState([]);
  const [highestBid, setHighestBid] = useState({
    team: "None",
    amount: 0,
    teamLogo: "",
  });
  const [showModal, setShowModal] = useState(false);

  const player = currentPlayer;

  const handleExtendTimer = (seconds) => {
    setEndTime((prev) => new Date(prev.getTime() + seconds * 1000));
  };

  const togglePause = () => setIsPaused((prev) => !prev);

  const handleTimeEnd = () => {
    setShowModal(true);
  };

  // When restarting or modifying, update bid history
  const handleRestart = () => {
    handleExtendTimer(60);
    setShowModal(false);
    setBids((prev) => [...prev, { ...highestBid }]);
  };

  const handleModify = (newTeam, newAmount) => {
    const modifiedBid = { ...highestBid, team: newTeam, amount: newAmount };
    setHighestBid(modifiedBid);
    setBids((prev) => [...prev, modifiedBid]);
    setShowModal(false);
    handleExtendTimer(60);
  };

  const simulateCaptainRequest = () => {
    const newReq = {
      id: Date.now(),
      type: "moreTime",
      text: "Blue Titans requested more time!",
      status: "pending",
    };
    setNotifications((prev) => [newReq, ...prev]);
  };

  const handleApprove = (id) => {
    setNotifications((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, status: "approved" } : msg))
    );
    const msg = notifications.find((m) => m.id === id);
    if (msg?.type === "moreTime") handleExtendTimer(60);
  };

  const handleReject = (id) => {
    setNotifications((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, status: "rejected" } : msg))
    );
  };

  return (
    <div className="px-6 py-8 space-y-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Premier League Auction 2025</h1>
        <AuctionTimer
          endTime={endTime}
          isPaused={isPaused}
          onTimeEnd={handleTimeEnd}
        />
        <div className="flex justify-center gap-2 mt-2">
          <button
            onClick={togglePause}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded text-sm"
          >
            {isPaused ? "Resume Auction" : "Pause Auction"}
          </button>
          <button
            onClick={() => handleExtendTimer(60)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded text-sm"
          >
            Extend Timer +1min
          </button>
          <button
            onClick={simulateCaptainRequest}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm"
          >
            Simulate Captain Request
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <CurrentPlayerCard player={player} highestBid={highestBid} />
        </div>
        <div className="space-y-4">
          <BidHistory bids={bids} />
          <TeamBudgets dummyTeams={dummyTeams} />
          <Notifications
            messages={notifications}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <BidModal
          highestBid={highestBid}
          onRestart={handleRestart}
          onModify={handleModify}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default AdminCurrentBid;
