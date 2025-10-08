import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

// Utility: time ago
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
      setTimeLeft(Math.max(Math.floor((endTime - Date.now()) / 1000), 0));
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
    <span className="text-xs sm:text-sm bg-red-500 px-3 py-1 rounded-full">
      {timeLeft > 0 ? `Time left: ${formatTime(timeLeft)}` : "Ended"}
    </span>
  );
};

// Current Bid Details Component
const CurrentBidDetails = ({ player, timerEnd }) => {
  const teamColor = player.color || "#ccc"; // use backend-provided color
  const bidIncrease =
    ((player.currentBid - player.basePrice) / player.basePrice) * 100 || 0;

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <AuctionTimer endTime={timerEnd} />
          <span className="text-xs sm:text-sm bg-red-500 px-3 py-1 rounded-full animate-pulse">
            ● ACTIVE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          {player.name || "Loading..."}
        </h1>
        <p className="text-sm sm:text-base text-blue-100">
          {player.country || "-"} • {player.specialty || "-"}
        </p>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">ODI Rating</p>
            <p className="text-3xl sm:text-4xl font-bold text-blue-600">
              {player.odRating || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">T20 Rating</p>
            <p className="text-3xl sm:text-4xl font-bold text-purple-600">
              {player.t20Rating || 0}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 mb-4 border-2 border-green-200">
          <p className="text-sm sm:text-base text-gray-600 mb-2">Current Bid</p>
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-600">
                ₹{player.currentBid || 0}
                <span className="text-2xl sm:text-3xl">CR</span>
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Base Price: ₹{player.basePrice || 0}CR • +
                {bidIncrease.toFixed(0)}%
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-green-200">
            <span className="text-sm sm:text-base text-gray-600">
              Leading Team
            </span>
            <div className="flex items-center gap-2">
              <span
                className="text-xl sm:text-2xl font-bold"
                style={{ color: teamColor }}
              >
                {player.leadingTeam || "-"}
              </span>
              <div
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full"
                style={{ backgroundColor: teamColor }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Auction Set</p>
            <p className="text-lg sm:text-xl font-bold text-gray-800">
              {player.auctionSet || "-"}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Total Bids</p>
            <p className="text-lg sm:text-xl font-bold text-gray-800">
              {player.totalBids || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Bid History Component
const BidHistorySection = ({ history = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold">Bid History</h2>
        <p className="text-xs sm:text-sm text-blue-100">
          Complete bidding timeline
        </p>
      </div>

      <div className="p-4 sm:p-6">
        <div className="space-y-3 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
          {history.map((bid, index) => {
            const teamColor = bid.team.color || "#ccc"; // use backend color
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
                    style={{ backgroundColor: teamColor }}
                  >
                    {bid.team.short}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                      {bid.team.teamName || bid.team}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {getTimeAgo(bid.timestamp)}
                    </p>
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

// Top Bids Section
// const TopBidsSection = ({ topBids = [], onSeeMore }) => {
//   const medals = ["🥇", "🥈", "🥉"];

//   return (
//     <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-5 sm:p-6">
//         <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide drop-shadow">
//           🏆 Top 3 Bids
//         </h2>
//         <p className="text-sm sm:text-base text-amber-100 font-medium">
//           The most valuable picks of this auction
//         </p>
//       </div>

//       {/* Bid List */}
//       <div className="p-5 sm:p-6 space-y-5">
//         {topBids.map((bid, index) => (
//           <div
//             key={bid._id}
//             className="group relative bg-white rounded-xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
//           >
//             {/* Medal Badge */}
//             <div className="absolute -top-3 -left-3 bg-white rounded-full shadow-md px-3 py-1 text-xl">
//               {medals[index]}
//             </div>

//             <div className="flex items-center justify-between">
//               {/* Player + Team Info */}
//               <div className="flex items-center gap-4">
//                 {/* Team Badge */}
//                 <div
//                   className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full text-white font-bold text-lg shadow-md"
//                   style={{
//                     background: `radial-gradient(circle at top left, ${bid.team.color}, #000)`,
//                   }}
//                 >
//                   {bid.team.short}
//                 </div>

//                 <div className="min-w-0">
//                   <h3 className="font-extrabold text-gray-800 text-lg sm:text-xl truncate">
//                     {bid.player.name}
//                   </h3>

//                   <div className="flex items-center gap-2 mt-1">
//                     <span
//                       className="text-sm sm:text-base font-semibold"
//                       style={{ color: bid.team.color }}
//                     >
//                       {bid.team.name}
//                     </span>
//                     <div
//                       className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-300"
//                       style={{ backgroundColor: bid.team.color }}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Bid Amount */}
//               <div className="text-right">
//                 <p className="text-3xl sm:text-4xl font-extrabold text-green-600 drop-shadow-sm">
//                   ₹{bid.amount}
//                 </p>
//                 <p className="text-xs sm:text-sm text-gray-500 font-medium">
//                   Crores
//                 </p>
//               </div>
//             </div>

//             {/* Sold timestamp */}
//             <div className="mt-3 text-xs text-gray-400 italic">
//               Sold on{" "}
//               {new Date(bid.player.sold.soldAt).toLocaleString("en-IN", {
//                 dateStyle: "medium",
//                 timeStyle: "short",
//               })}
//             </div>
//           </div>
//         ))}

//         {/* See More Button */}
//         <button
//           onClick={onSeeMore}
//           className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 sm:py-4 rounded-xl font-semibold text-base shadow-md hover:shadow-lg transition-all duration-300"
//         >
//           See All Players →
//         </button>
//       </div>
//     </div>
//   );
// };

const TopBidsSection = ({ topBids = [], onSeeMore }) => {
  const medals = [
    { label: "🥇", color: "from-yellow-400 to-amber-600" },
    { label: "🥈", color: "from-gray-300 to-gray-500" },
    { label: "🥉", color: "from-orange-400 to-red-500" },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto bg-[#080808] rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-600 via-orange-500 to-pink-600 px-5 sm:px-8 py-4 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Top 3 Bids
          </h2>
          <p className="text-xs sm:text-sm text-amber-100">Live Auction Highlights</p>
        </div>
        <span className="text-amber-200 text-xs sm:text-sm font-semibold bg-white/10 px-3 py-1 rounded-full border border-amber-300/30 backdrop-blur">
          #Leaderboard
        </span>
      </header>

      {/* Body */}
      <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#0a0a0a] space-y-5 sm:space-y-6">
        {topBids.map((bid, i) => {
          const medal = medals[i];
          return (
            <div
              key={bid._id}
              className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 rounded-2xl border border-gray-700/60 overflow-hidden
                hover:border-amber-400 transition-all duration-300 shadow-md hover:shadow-${bid.team.color}/40`}
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
              }}
            >
              {/* Medal stripe */}
              <div
                className={`absolute top-0 left-0 w-1 sm:w-1.5 h-full bg-gradient-to-b ${medal.color}`}
              />

              <div className="relative flex flex-1 items-center gap-4 sm:gap-6 p-4 sm:p-5">
                {/* Team badge */}
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center rounded-full text-sm sm:text-xl font-extrabold text-white border border-white/20 shadow-md"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${bid.team.color}, #000)`,
                  }}
                >
                  {bid.team.short}
                </div>

                {/* Player info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-xl font-bold text-white truncate">
                    {bid.player.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                    <span
                      className="text-xs sm:text-sm font-semibold"
                      style={{ color: bid.team.color }}
                    >
                      {bid.team.name}
                    </span>
                    <div
                      className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                      style={{ backgroundColor: bid.team.color }}
                    />
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                    Sold on 
                    {new Date(bid.player.sold.soldAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Bid amount */}
                <div className="text-right">
                  <p className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                    ₹{bid.amount}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500">Crores</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* CTA */}
        <button
          onClick={onSeeMore}
          className="w-full mt-4 sm:mt-6 py-3 sm:py-4 text-sm sm:text-lg font-semibold rounded-xl text-white
            bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700
            hover:from-blue-500 hover:via-indigo-500 hover:to-purple-600
            shadow-lg shadow-indigo-800/40 hover:shadow-indigo-600/60 transition-all"
        >
          See All Players →
        </button>
      </div>
    </section>
  );
};


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
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    const playerId = "68e167ecabc39f77566bfbf3";
    newSocket.emit("joinPlayerRoom", { playerId });

    newSocket.on("currentBidUpdated", (data) => {
      setCurrentBidPlayer(data.currentBid || {});
      setTimerEnd(data.currentBid?.timerEnd || Date.now() + 5 * 60 * 1000);
    });

    newSocket.on("bidHistoryUpdated", (data) => setBidHistory(data.bids || []));
    newSocket.on("topBidsUpdated", (data) => setTopBids(data.topBids || []));

    // Fetch initial data
    newSocket.emit("getCurrentBid", { playerId }, (res) => {
      if (res.success) {
        setCurrentBidPlayer(res.currentBid || {});
        setTimerEnd(res.currentBid?.timerEnd || Date.now() + 5 * 60 * 1000);
      }
    });

    newSocket.emit("getBidHistory", { playerId }, (res) => {
      if (res.success) {
        // console.log(res.bids)
        setBidHistory(res.bids || []);
      }
    });

    newSocket.emit(
      "getTop3Bids",
      { auctionId: "68e167ecabc39f77566bfbe4" },
      (res) => {
        if (res.success) {
          setTopBids(res.topBids || []);
        }
      }
    );

    return () => newSocket.disconnect();
  }, []);

  const handleSeeMore = () => {
    alert("In a real application, this would navigate to /players page");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            IPL Auction 2025
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Current Bidding Session
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <CurrentBidDetails player={currentBidPlayer} timerEnd={timerEnd} />

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
          <div className=" sm:mt-6 mb-5">
          <BidHistorySection history={bidHistory} />
        </div>
 
         
        </div>

        
        <div className="lg:col-span-1">
            <TopBidsSection topBids={topBids} onSeeMore={handleSeeMore} />
          </div>
      </div>
    </div>
  );
};

export default CurrentBid;
