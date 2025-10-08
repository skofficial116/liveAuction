// import React, { useState, useEffect } from "react";
// import { dummyTeams } from "../../../assets/assets";
// import { currentPlayer } from "../../../assets/assets";

// import { AppContext } from "../../../context/AppContext";
// import { useContext } from "react";

// // Auction Timer Component
// const AuctionTimer = ({ endTime }) => {
//   const [timeLeft, setTimeLeft] = useState(0);

//   const updateCountdown = () => {
//     const now = new Date();
//     const end = new Date(endTime);
//     setTimeLeft(Math.max(Math.floor((end - now) / 1000), 0));
//   };

//   useEffect(() => {
//     updateCountdown();
//     const timer = setInterval(updateCountdown, 1000);
//     return () => clearInterval(timer);
//   }, [endTime]);

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60)
//       .toString()
//       .padStart(2, "0");
//     const secs = (seconds % 60).toString().padStart(2, "0");
//     return `${mins}:${secs}`;
//   };

//   return (
//     <div className="text-lg font-bold text-blue-600">
//       {timeLeft > 0 ? `Time left: ${formatTime(timeLeft)}` : "Ended"}
//     </div>
//   );
// };

// // Current Player Card
// const CurrentPlayerCard = () => {
//   //   const {currentWinningBid}= useContext(AppContext)
//   //   // const [player, setPlayer]= useState({})

//   //  const bid= currentWinningBid();
//   // // highestBid, player
//   //  useEffect(()=>{
//   // setPlayer(bid.)
//   //  }, [bid])
//   let player = currentPlayer;
//   let highestBid = {
//     team: "Red Warriors",
//     teamLogo: "https://via.placeholder.com/40?text=RW",
//     amount: 250,
//   };
//   return (
//     <div className="bg-white rounded-lg shadow-lg p-6 text-center space-y-4">
//       <h2 className="text-2xl font-bold">{player.name}</h2>
//       <p className="text-gray-600">{player.fact}</p>
//       <p className="text-gray-500">Base Price: ${player.basePrice}K</p>

//       {/* Highest Bid Section */}
//       {highestBid ? (
//         <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//           <h3 className="text-lg font-semibold text-blue-700">
//             Current Highest Bid
//           </h3>
//           <p className="text-3xl font-bold text-blue-900">
//             ${highestBid.amount}K
//           </p>
//           <div className="flex items-center justify-center mt-2 space-x-2">
//             <img
//               src={highestBid.teamLogo}
//               alt={highestBid.team}
//               className="w-8 h-8 object-contain"
//             />
//             <span className="text-gray-800 font-semibold">
//               {highestBid.team}
//             </span>
//           </div>
//         </div>
//       ) : (
//         <p className="text-gray-500 italic">No bids yet</p>
//       )}

//       {/* Player Stats */}
//       <div className="text-sm text-gray-700 space-y-1">
//         <p>Bat Skill: {player.batSkill}</p>
//         <p>Bowl Skill: {player.bowlSkill}</p>
//         {/* <p>Wickets: {player.stats.wickets}</p> */}
//       </div>
//     </div>
//   );
// };

// // Bid Controls
// const BidControls = ({ currentBid, maxBudget, onBid }) => {
//   const [bid, setBid] = useState(currentBid || 0);
//   maxBudget = 310;
//   let step = bid < 100 ? 10 : 20;
//   let nextBid = bid + step;
//   const incrementBid = () => {
//     if (nextBid > maxBudget) {
//       alert("Cannot bid more than your budget!");
//       return;
//     } else {
//       setBid(nextBid);
//     }
//   };

//   const confirmBid = () => {
//     if (bid > maxBudget) {
//       alert("Cannot bid more than your budget!");
//       return;
//     }
//     if (window.confirm(`Are you sure to bid $${nextBid}K?`)) {
//       onBid(bid);
//       incrementBid();
//     }
//   };

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md space-y-2 text-center">
//       <h3 className="font-semibold text-gray-700">Place Your Bid</h3>
//       <p className="text-lg">Current Bid: ${bid}K</p>
//       <div className="flex justify-center gap-4">
//         <button
//           onClick={confirmBid}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//         >
//           Bid for ${nextBid}K
//         </button>
//       </div>
//       <p className="text-sm text-gray-500">Budget Left: ${maxBudget - bid}K</p>
//     </div>
//   );
// };

// // Need More Time Button
// const NeedMoreTimeButton = () => {
//   const handleClick = () => {
//     alert("Request for more time sent to Admin!");
//   };
//   return (
//     <button
//       onClick={handleClick}
//       className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded mt-4"
//     >
//       Need More Time
//     </button>
//   );
// };

// // Bid History
// const BidHistory = () => {
//   const { currentPlayerBidHistory, bidHistory } = useContext(AppContext);
  
// console.log(currentPlayerBidHistory)
//   useEffect(() => {
//     bidHistory(); // fetch initial bid history
//   }, [bidHistory]);

//   return (
//     <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
//       <h3 className="text-lg font-semibold">Bid History</h3>
//       <ul className="text-gray-700 text-sm space-y-1">
//         {currentPlayerBidHistory.map((bid, idx) => (
//           <li key={idx}>
//             <strong>{bid.teamName}</strong> → ${bid.amount}K,{" "}
//             <i>{bid.timestamp}</i>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// // Team Budgets
// const TeamBudgets = ({ dummyTeams }) => (
//   <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
//     {dummyTeams.map((team, idx) => (
//       <div
//         key={idx}
//         className="bg-white p-4 rounded-lg shadow-md text-center space-y-2"
//       >
//         <img src={team.logo} className="w-12 h-12 object-contain mx-auto" />
//         <h4 className="font-bold">{team.name}</h4>
//         <p className="text-sm text-gray-600">
//           Budget Left: ${team.budgetLeft}K
//         </p>
//         <p className="text-sm text-gray-500">
//           Players: {team.playersBought.length}
//         </p>
//       </div>
//     ))}
//   </div>
// );

// // Notifications
// const Notifications = ({ messages }) => (
//   <div className="bg-gray-100 p-3 rounded-lg h-40 overflow-y-auto">
//     {messages.map((msg, idx) => (
//       <p key={idx} className="text-sm text-gray-700">
//         🔔 {msg}
//       </p>
//     ))}
//   </div>
// );

// // Main Captain Current Bid Page
// const CaptainCurrentBid = () => {
//   const player = currentPlayer;

//   const bids = [
//     {
//       team: "Red Warriors",
//       teamLogo: "https://via.placeholder.com/40?text=RW",
//       amount: 220,
//     },
//     {
//       team: "Blue Titans",
//       teamLogo: "https://via.placeholder.com/40?text=BT",
//       amount: 230,
//     },
//     {
//       team: "Red Warriors",
//       teamLogo: "https://via.placeholder.com/40?text=RW",
//       amount: 250,
//     },
//   ];

//   const highestBid = bids[bids.length - 1];
//   const maxBudget = dummyTeams[0].budgetLeft;

//   const notifications = [
//     "Player Virat Kohli is on bid!",
//     "Blue Titans placed a bid of $230K",
//     "Red Warriors placed a bid of $250K",
//   ];

//   return (
//     <div className="px-6 py-8 space-y-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
//       {/* Header */}
//       <div className="text-center space-y-2">
//         <h1 className="text-3xl font-bold">Premier League Auction 2025</h1>
//         <AuctionTimer endTime={new Date(Date.now() + 2 * 60 * 1000)} />
//       </div>

//       {/* Main Content */}
//       {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         <div className="md:col-span-2 space-y-4">
//           <CurrentPlayerCard player={player} highestBid={highestBid} />
//           <BidControls
//             currentBid={highestBid.amount}
//             maxBudget={maxBudget}
//             onBid={(bid) => console.log(`You bid $${bid}K`)}
//           />
//           <NeedMoreTimeButton />
//         </div>

//         <div className="space-y-4">
//           <BidHistory />
//           <TeamBudgets dummyTeams={dummyTeams} />
//           <Notifications messages={notifications} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CaptainCurrentBid;



import React, { useState, useEffect } from 'react';
// import { use } from 'react';

// Dummy Data
const TEAMS = {
  MI: { name: 'Mumbai Indians', color: '#004BA0' },
  CSK: { name: 'Chennai Super Kings', color: '#FDB913' },
  RCB: { name: 'Royal Challengers Bangalore', color: '#EC1C24' },
  KKR: { name: 'Kolkata Knight Riders', color: '#3A225D' },
  DC: { name: 'Delhi Capitals', color: '#004C93' },
  RR: { name: 'Rajasthan Royals', color: '#254AA5' }
};

const CURRENT_BID_PLAYER = {
  name: 'Ben Stokes',
  country: 'England',
  odRating: 88,
  t20Rating: 91,
  currentBid: 18.5,
  leadingTeam: 'CSK',
  auctionSet: 'A',
  basePrice: 2.0,
  specialty: 'All-Rounder'
};

const BID_HISTORY = [
  { id: 1, amount: 18.5, team: 'CSK', timestamp: Date.now() - 15000 },
  { id: 2, amount: 17.5, team: 'MI', timestamp: Date.now() - 45000 },
  { id: 3, amount: 16.0, team: 'RCB', timestamp: Date.now() - 78000 },
  { id: 4, amount: 14.5, team: 'CSK', timestamp: Date.now() - 112000 },
  { id: 5, amount: 13.0, team: 'KKR', timestamp: Date.now() - 145000 },
  { id: 6, amount: 11.5, team: 'MI', timestamp: Date.now() - 189000 },
  { id: 7, amount: 10.0, team: 'DC', timestamp: Date.now() - 223000 },
  { id: 8, amount: 8.5, team: 'RR', timestamp: Date.now() - 267000 },
  { id: 9, amount: 7.0, team: 'RCB', timestamp: Date.now() - 301000 },
  { id: 10, amount: 5.5, team: 'CSK', timestamp: Date.now() - 345000 },
  { id: 11, amount: 4.0, team: 'MI', timestamp: Date.now() - 389000 },
  { id: 12, amount: 2.0, team: 'KKR', timestamp: Date.now() - 423000 }
];

const TOP_BIDS_AUCTION = [
  { id: 1, playerName: 'Pat Cummins', amount: 20.5, team: 'KKR', country: 'Australia', specialty: 'Bowler' },
  { id: 2, playerName: 'Sam Curran', amount: 19.8, team: 'RR', country: 'England', specialty: 'All-Rounder' },
  { id: 3, playerName: 'Ben Stokes', amount: 18.5, team: 'CSK', country: 'England', specialty: 'All-Rounder' },
  { id: 4, playerName: 'Nicholas Pooran', amount: 17.2, team: 'MI', country: 'West Indies', specialty: 'Wicket-Keeper' },
  { id: 5, playerName: 'Mitchell Starc', amount: 16.5, team: 'DC', country: 'Australia', specialty: 'Bowler' },
  { id: 6, playerName: 'Cameron Green', amount: 15.8, team: 'RCB', country: 'Australia', specialty: 'All-Rounder' }
];

// Utility function for timestamp
const getTimeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
};

// Current Bid Details Component
const CurrentBidDetails = ({ player }) => {
  const team = TEAMS[player.leadingTeam];
  const bidIncrease = ((player.currentBid - player.basePrice) / player.basePrice * 100).toFixed(0);
  
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-semibold bg-white bg-opacity-20 px-3 py-1 rounded-full">
            LIVE BIDDING
          </span>
          <span className="text-xs sm:text-sm bg-red-500 px-3 py-1 rounded-full animate-pulse">
            ● ACTIVE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{player.name}</h1>
        <p className="text-sm sm:text-base text-blue-100">{player.country} • {player.specialty}</p>
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
                ₹{player.currentBid}<span className="text-2xl sm:text-3xl">CR</span>
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Base Price: ₹{player.basePrice}CR • +{bidIncrease}% increase
              </p>
            </div>
          </div>
          
          {/* Leading Team */}
          <div className="flex items-center justify-between pt-4 border-t border-green-200">
            <span className="text-sm sm:text-base text-gray-600">Leading Team</span>
            <div className="flex items-center gap-2">
              <span 
                className="text-xl sm:text-2xl font-bold"
                style={{ color: team.color }}
              >
                {player.leadingTeam}
              </span>
              <div 
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full"
                style={{ backgroundColor: team.color }}
              />
            </div>
          </div>
        </div>
        
        {/* Additional Info */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Auction Set</p>
            <p className="text-3xl sm:text-4xl font-bold text-blue-600">{player.auctionSet}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Bids</p>
            <p className="text-3xl sm:text-4xl font-bold text-purple-600">{BID_HISTORY.length}</p>
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
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300' 
                    : 'bg-gray-50 hover:bg-gray-100'
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
                  <p className={`text-xl sm:text-2xl font-bold ${isLatest ? 'text-green-600' : 'text-gray-700'}`}>
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

// Top Bids Section Component
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
            const medals = ['🥇', '🥈', '🥉'];
            
            return (
              <div
                key={bid.id}
                className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 hover:shadow-md transition-all border border-gray-200"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="text-3xl sm:text-4xl flex-shrink-0">
                    {medals[index]}
                  </div>
                  
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
                      <span 
                        className="text-sm sm:text-base font-semibold"
                        style={{ color: team.color }}
                      >
                        {bid.team}
                      </span>
                      <div 
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                        style={{ backgroundColor: team.color }}
                      />
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

// Place Bid Button Component
const PlaceBidButton = ({ currentBid, userTeam, remainingBudget }) => {
  const nextBid = currentBid + 0.5; // Increment by 0.5 CR
  const budgetAfterBid = remainingBudget - nextBid;
  const canAfford = budgetAfterBid >= 0;
  const team = TEAMS[userTeam];
  
  const handlePlaceBid = () => {
    if (!canAfford) {
      alert('Insufficient budget to place this bid!');
      return;
    }
    // In a real app, this would submit the bid
    console.log(`Placing bid: ₹${nextBid}CR for team ${userTeam}`);
    alert(`Bid placed: ₹${nextBid}CR\nRemaining budget: ₹${budgetAfterBid.toFixed(1)}CR`);
  };
  
  return (
    <div className="mt-4 sm:mt-6">
      <button
        onClick={handlePlaceBid}
        disabled={!canAfford}
        className={`w-full py-4 sm:py-5 rounded-xl font-bold text-lg sm:text-xl transition-all shadow-lg ${
          canAfford
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:shadow-xl transform hover:scale-[1.02]'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Place Bid ₹{nextBid}CR
      </button>
      
      <div className="mt-3 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-sm sm:text-base text-gray-600">Your Team:</span>
          <span 
            className="font-semibold text-base sm:text-lg"
            style={{ color: team.color }}
          >
            {userTeam}
          </span>
          <div 
            className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
            style={{ backgroundColor: team.color }}
          />
        </div>
        
        <div className={`text-sm sm:text-base ${canAfford ? 'text-gray-600' : 'text-red-600 font-semibold'}`}>
          Current Budget: ₹{remainingBudget.toFixed(1)}CR
        </div>
        
        {canAfford ? (
          <div className="text-xs sm:text-sm text-green-600 font-medium mt-1">
            Budget after bid: ₹{budgetAfterBid.toFixed(1)}CR
          </div>
        ) : (
          <div className="text-xs sm:text-sm text-red-600 font-semibold mt-1">
            ⚠ Insufficient budget for this bid
          </div>
        )}
      </div>
    </div>
  );
};

// Main CurrentBidComponent
const CurrentBid= () => {
  // User role: 'audience' or 'captain'
  const [userRole, setUserRole] = useState('captain');
  const [userTeam, setUserTeam] = useState('MI');
  const [remainingBudget, setRemainingBudget] = useState(32.5);

  //  const pathParts = window.location.pathname.split("/").filter(Boolean);
  // const section = pathParts[0];

  useEffect(() => {
    setUserRole('captain');
  }, []);

  
  const handleSeeMore = () => {
    // In a real app, this would navigate to /players
    console.log('Navigating to /players');
    alert('In a real application, this would navigate to /players page');
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
          
          {/* Role Toggle for Demo */}
          {/* <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => setUserRole('audience')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                userRole === 'audience'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              👥 Audience View
            </button>
            <button
              onClick={() => setUserRole('captain')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                userRole === 'captain'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              🏏 Captain View
            </button>
          </div> */}
        </header>
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Current Bid Details */}
          <div className="lg:col-span-2">
            <CurrentBidDetails player={CURRENT_BID_PLAYER} />
            
            {/* Place Bid Button - Only for Captains */}
            {userRole === 'captain' && (
              <div className="mt-4 sm:mt-6">
                <PlaceBidButton 
                  currentBid={CURRENT_BID_PLAYER.currentBid}
                  userTeam={userTeam}
                  remainingBudget={remainingBudget}
                />
              </div>
            )}
          </div>
          
          {/* Right Column - Top Bids */}
          <div className="lg:col-span-1">
            <TopBidsSection topBids={TOP_BIDS_AUCTION} onSeeMore={handleSeeMore} />
          </div>
        </div>
        
        {/* Bid History - Full Width */}
        <div className="mt-4 sm:mt-6">
          <BidHistorySection history={BID_HISTORY} />
        </div>
      </div>
    </div>
  );
};

export default CurrentBid;