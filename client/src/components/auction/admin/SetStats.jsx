import React from "react";

const SetStats = ({ players }) => {
  const totalPlayers = players.length;
  const avgBase = players.length
    ? (players.reduce((sum, p) => sum + p.basePrice, 0) / players.length).toFixed(1)
    : 0;
  const soldCount = players.filter(p => p.soldPrice).length;

  return (
    <div className="p-4 border rounded-lg bg-gray-50 w-full md:w-1/2">
      <h4 className="font-semibold text-gray-700 mb-2">Set Statistics</h4>
      <p>Total Players: {totalPlayers}</p>
      <p>Avg Base Price: ${avgBase}</p>
      <p>Sold Players: {soldCount}</p>
    </div>
  );
};

export default SetStats;
