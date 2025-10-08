import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import { io } from "socket.io-client";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppContextProvider = (props) => {
  // const navigate = useNavigate();
  // const [currentPlayerBidHistory, setCurrentPlayerBidHistory] = useState([]);
  // const [usersConnected, setUsersConnected] = useState(0);

  // const socket = io.connect("http://localhost:3100");

  // const playerId = "68decb1aaa33d607dc4c5580";
  // const auctionId = "68decb1aaa33d607dc4c5571";

  // const placeBid = (playerId, bid, teamId) => {
  //   socket.emit("placeBid", { playerId, bid, teamId });
  // };

  // const currentWinningBid = (callback) => {
  //   socket.once("winningBid", (data) => {
  //     callback(data);
  //   });
  // };

  // const bidHistory = () => {
  //   socket.emit("bidHistory", { playerId, auctionId });
  // };

  // const findTotalUsersConnected = () => {
  //   socket.on("userConnected", (data) => {
  //     setUsersConnected(data.usersCount);
  //   });
  // };

  // useEffect(() => {
  //   const handleUsersConnected = (data) => {
  //     setUsersConnected(data.usersCount);
  //   };

  //   // socket.on("userConnected", handleUsersConnected);

  //   // Clean up listener on unmount
  //   return () => {
  //     socket.off("userConnected", handleUsersConnected);
  //   };
  // }, [socket]);

  // useEffect(() => {
  //   const handleBidHistory = (data) => setCurrentPlayerBidHistory(data);

  //   socket.on("bidHistory", handleBidHistory);
  //   // socket.on("userConnected", handleUsersConnected);

  //   return () => {
  //     socket.off("bidHistory", handleBidHistory);
  //     // socket.off("userConnected", handleUsersConnected);
  //     socket.disconnect();
  //   };
  // }, [socket]);
  const value = {
    // placeBid,
    // currentWinningBid,
    // bidHistory,
    // currentPlayerBidHistory,
    // usersConnected,
    // findTotalUsersConnected,
    // navigate,
    // socket,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
