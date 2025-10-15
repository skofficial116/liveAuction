import { useState, useEffect } from "react";
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

export default AuctionTimer