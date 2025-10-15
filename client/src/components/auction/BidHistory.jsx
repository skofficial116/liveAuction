const getTimeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
};

// Auction Timer Component
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

export default BidHistorySection