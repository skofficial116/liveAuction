import React, { useState, useEffect } from "react";
import { dummyTeams } from "../../../assets/assets";
import { currentPlayer } from "../../../assets/assets";

import { AppContext } from "../../../context/AppContext";
import { useContext } from "react";

// Auction Timer Component
const AuctionTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const updateCountdown = () => {
    const now = new Date();
    const end = new Date(endTime);
    setTimeLeft(Math.max(Math.floor((end - now) / 1000), 0));
  };

  useEffect(() => {
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="text-lg font-bold text-blue-600">
      {timeLeft > 0 ? `Time left: ${formatTime(timeLeft)}` : "Ended"}
    </div>
  );
};

// Current Player Card
const CurrentPlayerCard = () => {
  //   const {currentWinningBid}= useContext(AppContext)
  //   // const [player, setPlayer]= useState({})

  //  const bid= currentWinningBid();
  // // highestBid, player
  //  useEffect(()=>{
  // setPlayer(bid.)
  //  }, [bid])
  let player = currentPlayer;
  let highestBid = {
    team: "Red Warriors",
    teamLogo: "https://via.placeholder.com/40?text=RW",
    amount: 250,
  };
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center space-y-4">
      <h2 className="text-2xl font-bold">{player.name}</h2>
      <p className="text-gray-600">{player.fact}</p>
      <p className="text-gray-500">Base Price: ${player.basePrice}K</p>

      {/* Highest Bid Section */}
      {highestBid ? (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-700">
            Current Highest Bid
          </h3>
          <p className="text-3xl font-bold text-blue-900">
            ${highestBid.amount}K
          </p>
          <div className="flex items-center justify-center mt-2 space-x-2">
            <img
              src={highestBid.teamLogo}
              alt={highestBid.team}
              className="w-8 h-8 object-contain"
            />
            <span className="text-gray-800 font-semibold">
              {highestBid.team}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 italic">No bids yet</p>
      )}

      {/* Player Stats */}
      <div className="text-sm text-gray-700 space-y-1">
        <p>Bat Skill: {player.batSkill}</p>
        <p>Bowl Skill: {player.bowlSkill}</p>
        {/* <p>Wickets: {player.stats.wickets}</p> */}
      </div>
    </div>
  );
};

// Bid Controls
const BidControls = ({ currentBid, maxBudget, onBid }) => {
  const [bid, setBid] = useState(currentBid || 0);
  maxBudget = 310;
  let step = bid < 100 ? 10 : 20;
  let nextBid = bid + step;
  const incrementBid = () => {
    if (nextBid > maxBudget) {
      alert("Cannot bid more than your budget!");
      return;
    } else {
      setBid(nextBid);
    }
  };

  const confirmBid = () => {
    if (bid > maxBudget) {
      alert("Cannot bid more than your budget!");
      return;
    }
    if (window.confirm(`Are you sure to bid $${nextBid}K?`)) {
      onBid(bid);
      incrementBid();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-2 text-center">
      <h3 className="font-semibold text-gray-700">Place Your Bid</h3>
      <p className="text-lg">Current Bid: ${bid}K</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={confirmBid}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Bid for ${nextBid}K
        </button>
      </div>
      <p className="text-sm text-gray-500">Budget Left: ${maxBudget - bid}K</p>
    </div>
  );
};

// Need More Time Button
const NeedMoreTimeButton = () => {
  const handleClick = () => {
    alert("Request for more time sent to Admin!");
  };
  return (
    <button
      onClick={handleClick}
      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded mt-4"
    >
      Need More Time
    </button>
  );
};

// Bid History
const BidHistory = () => {
  const { currentPlayerBidHistory, bidHistory } = useContext(AppContext);
  
console.log(currentPlayerBidHistory)
  useEffect(() => {
    bidHistory(); // fetch initial bid history
  }, [bidHistory]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
      <h3 className="text-lg font-semibold">Bid History</h3>
      <ul className="text-gray-700 text-sm space-y-1">
        {currentPlayerBidHistory.map((bid, idx) => (
          <li key={idx}>
            <strong>{bid.teamName}</strong> → ${bid.amount}K,{" "}
            <i>{bid.timestamp}</i>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Team Budgets
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

// Notifications
const Notifications = ({ messages }) => (
  <div className="bg-gray-100 p-3 rounded-lg h-40 overflow-y-auto">
    {messages.map((msg, idx) => (
      <p key={idx} className="text-sm text-gray-700">
        🔔 {msg}
      </p>
    ))}
  </div>
);

// Main Captain Current Bid Page
const CaptainCurrentBid = () => {
  const player = currentPlayer;

  const bids = [
    {
      team: "Red Warriors",
      teamLogo: "https://via.placeholder.com/40?text=RW",
      amount: 220,
    },
    {
      team: "Blue Titans",
      teamLogo: "https://via.placeholder.com/40?text=BT",
      amount: 230,
    },
    {
      team: "Red Warriors",
      teamLogo: "https://via.placeholder.com/40?text=RW",
      amount: 250,
    },
  ];

  const highestBid = bids[bids.length - 1];
  const maxBudget = dummyTeams[0].budgetLeft;

  const notifications = [
    "Player Virat Kohli is on bid!",
    "Blue Titans placed a bid of $230K",
    "Red Warriors placed a bid of $250K",
  ];

  return (
    <div className="px-6 py-8 space-y-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Premier League Auction 2025</h1>
        <AuctionTimer endTime={new Date(Date.now() + 2 * 60 * 1000)} />
      </div>

      {/* Main Content */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <CurrentPlayerCard player={player} highestBid={highestBid} />
          <BidControls
            currentBid={highestBid.amount}
            maxBudget={maxBudget}
            onBid={(bid) => console.log(`You bid $${bid}K`)}
          />
          <NeedMoreTimeButton />
        </div>

        <div className="space-y-4">
          <BidHistory />
          <TeamBudgets dummyTeams={dummyTeams} />
          <Notifications messages={notifications} />
        </div>
      </div>
    </div>
  );
};

export default CaptainCurrentBid;
