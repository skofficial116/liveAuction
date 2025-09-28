import React, { useState, useEffect } from "react";
import { dummyPlayers} from "../../../assets/assets";

const AdminSettings = () => {
  const [bidDuration, setBidDuration] = useState(4 * 60); // 4 minutes in seconds
  const [maxExtensions, setMaxExtensions] = useState(2);
  const [auctionStatus, setAuctionStatus] = useState("paused"); // paused | live | ended
  const [currentSet, setCurrentSet] = useState("A");
  const [timeLeft, setTimeLeft] = useState(bidDuration);
  const [currentPlayer, setCurrentPlayer] = useState(
    dummyPlayers.find((p) => p.set === currentSet && !p.soldPrice)
  );

  const sets = [...new Set(dummyPlayers.map((p) => p.set))];

  // Countdown Timer
  useEffect(() => {
    if (auctionStatus !== "live") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [auctionStatus]);

  // Reset timer when player changes
  useEffect(() => {
    setTimeLeft(bidDuration);
  }, [currentPlayer, bidDuration]);

  const handleApproveSet = () => {
    alert(`Set ${currentSet} approved for auction!`);
  };

  const handleRejectSet = () => {
    const remainingSets = sets.filter((s) => s !== currentSet);
    setCurrentSet(
      remainingSets[Math.floor(Math.random() * remainingSets.length)]
    );
    const nextPlayer = dummyPlayers.find(
      (p) => p.set === remainingSets[0] && !p.soldPrice
    );
    setCurrentPlayer(nextPlayer);
  };

  const handleGoLive = () => {
    setAuctionStatus("live");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Auction Status */}
      <div className="flex items-center justify-between bg-gray-100 p-4 rounded">
        <div>
          <h2 className="font-bold text-lg">Auction Status:</h2>
          <p className="text-blue-600">{auctionStatus.toUpperCase()}</p>
        </div>
      </div>

      {/* Set Approval */}
      <div className="bg-gray-50 p-4 rounded shadow">
        <h2 className="font-bold text-lg mb-2">Current Set: {currentSet}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {dummyPlayers
            .filter((p) => p.set === currentSet)
            .map((player) => (
              <div
                key={player.id}
                className="border p-2 rounded flex flex-col items-center"
              >
                <p className="font-semibold">{player.name}</p>
                <p className="text-sm">{player.role}</p>
                <p className="text-xs text-gray-500">
                  Base: {player.basePrice} | Sold: {player.soldPrice || "-"}
                </p>
              </div>
            ))}
        </div>
        <div className="space-x-2">
          <button
            onClick={handleApproveSet}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Approve Set
          </button>
          <button
            onClick={handleRejectSet}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Reject Set
          </button>
        </div>
      </div>

      {/* Auction Parameters */}
      <div className="bg-gray-100 p-4 rounded shadow space-y-4">
        <h2 className="font-bold text-lg">Auction Parameters</h2>
        <div className="flex space-x-4 items-center">
          <label>Default Bid Duration (mins):</label>
          <input
            type="number"
            value={Math.floor(bidDuration / 60)}
            min={1}
            max={10}
            onChange={(e) => setBidDuration(Number(e.target.value) * 60)}
            className="border px-2 py-1 rounded w-20"
          />
        </div>
        <div className="flex space-x-4 items-center">
          <label>Maximum Timer Extensions:</label>
          <input
            type="number"
            value={maxExtensions}
            min={0}
            max={5}
            onChange={(e) => setMaxExtensions(Number(e.target.value))}
            className="border px-2 py-1 rounded w-20"
          />
        </div>
      </div>

      {/* Sticky Go Live Button & Countdown */}
      <div className="fixed bottom-6 right-6 bg-white shadow-lg p-4 rounded flex flex-col items-center z-50">
        <p className="font-semibold mb-2">
          {currentPlayer ? currentPlayer.name : "No player"}{" "}
          {auctionStatus === "live" ? "- LIVE" : ""}
        </p>
        <p className="text-xl font-bold mb-2">{formatTime(timeLeft)}</p>
        {auctionStatus !== "live" && (
          <button
            onClick={handleGoLive}
            className="bg-green-500 text-white px-6 py-2 rounded"
          >
            Go Live
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
