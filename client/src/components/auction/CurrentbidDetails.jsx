import { useState } from "react";
import AuctionTimer from "./AuctionTimer";
import { Gavel } from "lucide-react";

const CurrentBidDetails = ({
  playerData,
  timerEnd,
  remainingBudget,
  placeBid,
}) => {
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownProgress, setCooldownProgress] = useState(0);

  const { player, team, amount } = playerData;
  const topAttributes = (player?.attributes || [])
    .sort((a, b) => a.order - b.order)
    .slice(0, 2);

  const teamColor = team?.color || "#ccc";
  const currentBid = amount || 0;
  const basePrice = player?.basePrice || 0;
  const bidIncrease = ((currentBid - basePrice) / basePrice) * 100 || 0;

  // Handle Place Bid with cooldown
  const handlePlaceBid = () => {
    if (isCooldown) return; // Prevent clicking during cooldown

    placeBid(); // Your original function
    setIsCooldown(true);
    setCooldownProgress(0);

    const cooldownDuration = 3000; // 3 seconds
    const interval = 50; // update every 50ms
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      setCooldownProgress((elapsed / cooldownDuration) * 100);
      if (elapsed >= cooldownDuration) {
        clearInterval(timer);
        setIsCooldown(false);
      }
    }, interval);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <AuctionTimer endTime={timerEnd} />
          <span className="text-xs sm:text-sm bg-red-500 px-3 py-1 rounded-full animate-pulse">
            ● ACTIVE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          {player?.name || "Loading..."}
        </h1>
        <p className="text-sm sm:text-base text-blue-100">
          {player?.country || "-"} • {player?.specialty || "-"}
        </p>
      </div>

      <div className="p-4 sm:p-6">
        {/* Top two attributes */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
          {topAttributes.map((attr) => (
            <div
              key={attr.name}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center"
            >
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                {attr.displayName}
              </p>
              <p className="text-3xl sm:text-4xl font-bold text-blue-600">
                {attr.defaultValue ?? 0}
              </p>
            </div>
          ))}
        </div>

        {/* Current Bid Section */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 mb-4 border-2 border-green-200">
          <p className="text-sm sm:text-base text-gray-600 mb-2">Current Bid</p>
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-600">
                ₹{currentBid}
                <span className="text-2xl sm:text-3xl">CR</span>
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Base Price: ₹{basePrice}CR • +{bidIncrease.toFixed(0)}%
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
                {team?.name || "-"}
              </span>
              <div
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full"
                style={{ backgroundColor: teamColor }}
              />
            </div>
          </div>
        </div>

        {/* Auction set, total bids, etc. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Auction Set</p>
            <p className="text-lg sm:text-xl font-bold text-gray-800">
              {player?.auctionSet.name || "-"}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Total Bids</p>
            <p className="text-lg sm:text-xl font-bold text-gray-800">
              {playerData?.totalBids || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Place Bid Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handlePlaceBid}
          disabled={isCooldown}
          className={`flex items-center gap-3 min-w-[180px] sm:min-w-[220px] py-3 sm:py-4 px-6 text-white font-bold text-lg sm:text-xl rounded-full shadow-2xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-700 ${
            isCooldown
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-gray-900 to-black hover:shadow-3xl"
          }`}
        >
          <Gavel className="w-8 h-8 sm:w-9 sm:h-9 text-teal-400" />
          <span>
            {isCooldown
              ? `Wait ${(3 - (cooldownProgress / 100) * 3).toFixed(1)}s`
              : `Place Bid ₹${(currentBid + 0.5).toFixed(1)}CR`}
          </span>
        </button>

        {/* Progress Bar */}
        {isCooldown && (
          <div className="w-full mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-400 transition-all"
              style={{ width: `${cooldownProgress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentBidDetails;
