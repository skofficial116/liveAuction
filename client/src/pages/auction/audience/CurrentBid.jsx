import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // For "See All" button
import { dummyTeams, bids, notifications, currentPlayer, soldPlayers } from "../../../assets/assets";  

// Timer Component (unchanged)
const AuctionTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const updateCountdown = () => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = Math.max(Math.floor((end - now) / 1000), 0);
    setTimeLeft(diff);
  };

  useEffect(() => {
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const formatTime = (seconds) => {
    if (seconds <= 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="text-lg font-bold text-blue-600">
      {timeLeft > 0 ? `Time left: ${formatTime(timeLeft)}` : "Ended"}
    </div>
  );
};

// Player Card (unchanged)
const CurrentPlayerCard = ({ player }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 text-center space-y-3">
    <img
      src={player.photo}
      alt={player.name}
      className="w-32 h-32 object-cover rounded-full mx-auto"
    />
    <h2 className="text-2xl font-bold text-gray-800">{player.name}</h2>
    <p className="text-gray-600">{player.role}</p>
    <p className="text-gray-500">Base Price: ${player.basePrice}K</p>
    <div className="text-sm text-gray-700 space-y-1">
      <p>BatSkill: {player.batSkill}</p>
      <p>BowlSkill: {player.bowlSkill}</p>
      {player.fact?<p>Fact: {player.fact}</p>:""}
    </div>
  </div>
);

// Bid History (unchanged)
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

// dummyTeams Overview (unchanged)
const TeamBudgets = ({ dummyTeams }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {dummyTeams.map((team, idx) => (
      <div
        key={idx}
        className="bg-white p-4 rounded-lg shadow-md text-center space-y-2"
      >
        <img
          src={team.logo}
          alt={team.name}
          className="w-12 h-12 object-contain mx-auto"
        />
        <h4 className="font-bold text-gray-800">{team.name}</h4>
        <p className="text-sm text-gray-600">Budget Left: ${team.budgetLeft}K</p>
        <p className="text-sm text-gray-500">Players: {team.playersBought.length}</p>
      </div>
    ))}
  </div>
);

// Notifications (unchanged)
const Notifications = ({ messages }) => (
  <div className="bg-gray-100 p-3 rounded-lg h-40 overflow-y-auto">
    {messages.map((msg, idx) => (
      <p key={idx} className="text-sm text-gray-700">
        🔔 {msg}
      </p>
    ))}
  </div>
);

// Top 3 Sold Players
const TopPlayers = ({ players }) => {
  const top3 = [...players]
    .sort((a, b) => b.soldPrice - a.soldPrice)
    .slice(0, 3);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Top 3 Sold Players</h3>
        <Link
          to="/audience/auctionHistory"
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          See All
        </Link>
      </div>
      <ul className="space-y-2">
        {top3.map((player, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center bg-blue-50 p-2 rounded-md shadow-sm"
          >
            <div className="space-y-1">
              <p className="font-medium text-gray-800">
                {idx + 1}. {player.name} ({player.role})
              </p>
              <p className="text-sm text-gray-600">Sold to: {player.team}</p>
            </div>
            <span className="font-bold text-blue-600">${player.soldPrice}K</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Main Page
const CurrentBid = () => {
 

  return (
    <div className="px-6 py-8 space-y-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">Premier League Auction 2025</h1>
        <AuctionTimer endTime={new Date(Date.now() + 2 * 60 * 1000)} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Current Player */}
        <div className="md:col-span-2 space-y-4">
          <CurrentPlayerCard player={currentPlayer} />
          <BidHistory bids={bids} />
        </div>

        {/* Top 3 Sold Players */}
        <TopPlayers players={soldPlayers} />
      </div>

      {/* dummyTeams */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Teams</h2>
        <TeamBudgets dummyTeams={dummyTeams} />
      </div>

      {/* Notifications */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Live Updates</h2>
        <Notifications messages={notifications} />
      </div>
    </div>
  );
};


export default CurrentBid;
