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
          <p className="text-xs sm:text-sm text-amber-100">
            Live Auction Highlights
          </p>
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
                    {new Date(bid.player.sold.soldAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
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

export default TopBidsSection;
