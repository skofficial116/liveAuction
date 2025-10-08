import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

// Team colors
const TEAMS = {
  MM: { name: "Mumbai Indians", color: "#004BA0" },
  CC: { name: "Chennai Super Kings", color: "#FDB913" },
  RCB: { name: "Royal Challengers Bangalore", color: "#EC1C24" },
  KK: { name: "Kolkata Knight Riders", color: "#3A225D" },
  DD: { name: "Delhi Capitals", color: "#004C93" },
  RR: { name: "Rajasthan Royals", color: "#254AA5" },
};

// Utility: Time ago
const getTimeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
};

// Auction Timer Component
const AuctionTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(
    Math.max(Math.floor((endTime - Date.now()) / 1000), 0)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.max(Math.floor((endTime - Date.now()) / 1000), 0);
      setTimeLeft(diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <span className="text-xs sm:text-sm font-semibold bg-white bg-opacity-20 px-3 py-1 rounded-full">
      {timeLeft > 0 ? `Time left: ${formatTime(timeLeft)}` : "Ended"}
    </span>
  );
};

// Current Bid Details Component
const CurrentBidDetails = ({ player, timerEnd }) => {
  const team = player.leadingTeam ? TEAMS[player.leadingTeam] : { color: "#ccc" };
  const bidIncrease =
    ((player.currentBid - player.basePrice) / player.basePrice) * 100 || 0;

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          {/* Auction Timer */}
          <AuctionTimer endTime={timerEnd} />

          <span className="text-xs sm:text-sm bg-red-500 px-3 py-1 rounded-full animate-pulse">
            ● ACTIVE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{player.name}</h1>
        <p className="text-sm sm:text-base text-blue-100">
          {player.country} • {player.specialty}
        </p>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        {/* Ratings */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">ODI Rating</p>
            <p className="text-3xl sm:text-4xl font-bold text-blue-600">{player.odRating}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">T20 Rating</p>
            <p className="text-3xl sm:text-4xl font-bold text-purple-600">{player.t20Rating}</p>
          </div>
        </div>

        {/* Current Bid */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 mb-4 border-2 border-green-200">
          <p className="text-sm sm:text-base text-gray-600 mb-2">Current Bid</p>
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-600">
                ₹{player.currentBid}
                <span className="text-2xl sm:text-3xl">CR</span>
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Base Price: ₹{player.basePrice}CR • +{bidIncrease.toFixed(0)}%
              </p>
            </div>
          </div>

          {/* Leading Team */}
          <div className="flex items-center justify-between pt-4 border-t border-green-200">
            <span className="text-sm sm:text-base text-gray-600">Leading Team</span>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold" style={{ color: team.color }}>
                {player.leadingTeam}
              </span>
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full" style={{ backgroundColor: team.color }} />
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Auction Set</p>
            <p className="text-lg sm:text-xl font-bold text-gray-800">{player.auctionSet}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Total Bids</p>
            <p className="text-lg sm:text-xl font-bold text-gray-800">{player.totalBids || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Bid History Component
const BidHistorySection = ({ history }) => {
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold">Bid History</h2>
        <p className="text-xs sm:text-sm text-blue-100">Complete bidding timeline</p>
      </div>

      <div className="p-4 sm:p-6">
        <div className="space-y-3 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
          {history.map((bid, index) => {
            const team = TEAMS[bid.team];
            const isLatest = index === 0;

            return (
              <div
                key={bid.id}
                className={`flex items-center justify-between p-3 sm:p-4 rounded-lg transition-all ${
                  isLatest
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                    style={{ backgroundColor: team.color }}
                  >
                    {bid.team}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                      {team.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">{getTimeAgo(bid.timestamp)}</p>
                  </div>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  <p
                    className={`text-xl sm:text-2xl font-bold ${
                      isLatest ? "text-green-600" : "text-gray-700"
                    }`}
                  >
                    ₹{bid.amount}
                  </p>
                  <p className="text-xs text-gray-500">CR</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Top Bids Component
const TopBidsSection = ({ topBids, onSeeMore }) => {
  const displayBids = topBids.slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold">Top 3 Bids</h2>
        <p className="text-xs sm:text-sm text-amber-100">Highest bids in the auction</p>
      </div>

      <div className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {displayBids.map((bid, index) => {
            const team = TEAMS[bid.team];
            const medals = ["🥇", "🥈", "🥉"];

            return (
              <div
                key={bid.id}
                className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 hover:shadow-md transition-all border border-gray-200"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="text-3xl sm:text-4xl flex-shrink-0">{medals[index]}</div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-base sm:text-lg truncate">
                      {bid.playerName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 mt-1">
                      <span>{bid.country}</span>
                      <span>•</span>
                      <span>{bid.specialty}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm sm:text-base font-semibold" style={{ color: team.color }}>
                        {bid.team}
                      </span>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" style={{ backgroundColor: team.color }} />
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl sm:text-3xl font-bold text-green-600">₹{bid.amount}</p>
                    <p className="text-xs sm:text-sm text-gray-500">CR</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onSeeMore}
          className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base transition-all shadow-md hover:shadow-lg"
        >
          See All Players →
        </button>
      </div>
    </div>
  );
};

// Main Component
const CurrentBid = () => {
  const [socket, setSocket] = useState(null);
  const [currentBidPlayer, setCurrentBidPlayer] = useState({});
  const [bidHistory, setBidHistory] = useState([]);
  const [topBids, setTopBids] = useState([]);
  const [timerEnd, setTimerEnd] = useState(Date.now() + 5 * 60 * 1000);
  const [userRole, setUserRole] = useState("audience");
  const [userTeam, setUserTeam] = useState("MI");
  const [remainingBudget, setRemainingBudget] = useState(32.5);

  useEffect(() => {
    const newSocket = io("http://localhost:4000"); // replace with your backend URL
    setSocket(newSocket);

    const playerId = "playerId123"; // dynamic player id
    newSocket.emit("joinPlayerRoom", { playerId });

    // Listen for updates
    newSocket.on("currentBidUpdated", (data) => {
      setCurrentBidPlayer(data.currentBid);
      setTimerEnd(data.currentBid.timerEnd || Date.now() + 5 * 60 * 1000);
    });

    newSocket.on("bidHistoryUpdated", (data) => setBidHistory(data.bids));
    newSocket.on("topBidsUpdated", (data) => setTopBids(data.topBids));

    // Fetch initial data
    newSocket.emit("getCurrentBid", { playerId }, (res) => {
      if (res.success) {
        setCurrentBidPlayer(res.currentBid);
        setTimerEnd(res.currentBid.timerEnd || Date.now() + 5 * 60 * 1000);
      }
    });

    newSocket.emit("getBidHistory", { playerId }, (res) => {
      if (res.success) setBidHistory(res.bids);
    });

    newSocket.emit("getTop3Bids", { auctionId: "auction123" }, (res) => {
      if (res.success) setTopBids(res.topBids);
    });

    return () => newSocket.disconnect();
  }, []);

  const handleSeeMore = () => {
    alert("In a real application, this would navigate to /players page");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            IPL Auction 2025
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Current Bidding Session</p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <CurrentBidDetails player={currentBidPlayer} timerEnd={timerEnd} />

            {/* Place Bid Button */}
            {userRole === "captain" && (
              <div className="mt-4 sm:mt-6">
                <button
                  className="w-full py-4 sm:py-5 rounded-xl font-bold text-lg sm:text-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                  onClick={() => alert("Place bid action here")}
                >
                  Place Bid ₹{(currentBidPlayer.currentBid || 0) + 0.5}CR
                </button>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <TopBidsSection topBids={topBids} onSeeMore={handleSeeMore} />
          </div>
        </div>

        {/* Bid History */}
        <div className="mt-4 sm:mt-6">
          <BidHistorySection history={bidHistory} />
        </div>
      </div>
    </div>
  );
};

export default CurrentBid;
