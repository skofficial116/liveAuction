import React, { useState, useEffect } from "react";

const AuctionCountdown = ({startTime, endTime}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState("not_started"); // not_started | live | ended

  // Helper to calculate remaining seconds based on current time
  const calculateTimeLeft = () => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) {
      setStatus("not_started");
      return Math.floor((start - now) / 1000);
    } else if (now >= start && now <= end) {
      setStatus("live");
      return Math.floor((end - now) / 1000);
    } else {
      setStatus("ended");
      return 0;
    }
  };

  useEffect(() => {
    // Initialize countdown
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          const updated = calculateTimeLeft(); // recalc dynamically from current time
          return updated;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  const formatTime = (seconds) => {
    if (seconds <= 0) return "00:00:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="text-blue-600 font-bold">
      {status === "live"
        ? "Live"
        : status === "ended"
        ? "Ended"
        : `Starts in ${formatTime(timeLeft)}`}
    </div>
  );
};

export default AuctionCountdown;
