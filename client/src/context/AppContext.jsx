import { createContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppContextProvider = (props) => {
 const auctionId = "68e7d370af6b023b9c3f1cc5";
  const playerId = "68e7d370af6b023b9c3f1cd4";
  function placeBid() {
    const pendingToastId = toast.loading("Placing your bid...", {
      position: "top-right",
      closeOnClick: false,
      autoClose: false, 
    });
  
    axios
      .post(
        "http://localhost:4000/auctionMeta/placeBid",
        {
          auction: auctionId,
          player: playerId,
          amount: 310,
        },
        { withCredentials: true }
      )
      .then((res) => {
        // 2. Update toast with success or error
        if (res.data.success) {
          toast.update(pendingToastId, {
            render: res.data.msg,
            type: "success",
            isLoading: false,
            autoClose: 3000,
            closeOnClick: true,
          });
        } else {
          toast.update(pendingToastId, {
            render: res.data.msg || "Failed to place bid",
            type: "error",
            isLoading: false,
            autoClose: 3000,
            closeOnClick: true,
          });
        }
      })
      .catch((err) => {
        toast.update(pendingToastId, {
          render: "Something went wrong!",
          type: "error",
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
        });
        console.error(err);
      });
  }
  

  const [socket, setSocket] = useState(null);
  const [currentBidPlayer, setCurrentBidPlayer] = useState({});
  const [bidHistory, setBidHistory] = useState([]);
  const [topBids, setTopBids] = useState([]);
  const [timerEnd, setTimerEnd] = useState(Date.now() + 5 * 60 * 1000);

  const [remainingBudget, setRemainingBudget] = useState(32.5);

  const [role, setRole] = useState("");
    const [userName, setUserName] = useState("");
    const [teamId, setTeamId] =useState(""); // captain only

  const setCookie = (name, value, days = 1) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();

  // Always stringify objects
  if (typeof value === "object") {
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};${expires};path=/`;
  } else {
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
  }
};

  const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (!match) return null;
  const value = decodeURIComponent(match[2]); // <-- decode here
  try {
    return JSON.parse(value); // will return object if it's JSON
  } catch {
    return value; // fallback for strings
  }
};


useEffect(()=>{
const newSocket = io("http://localhost:4000", { withCredentials: true });
    setSocket(newSocket);

    // const playerId = "68e7d370af6b023b9c3f1cd0";

    newSocket.emit("joinPlayerRoom", { auctionId });

    newSocket.on("currentBidUpdated", (data) => {
      setCurrentBidPlayer(data.currentBid || {});
      setTimerEnd(data.currentBid?.timerEnd || Date.now() + 5 * 60 * 1000);
    });

    newSocket.on("bidHistoryUpdated", (data) => setBidHistory(data.bids || []));
    newSocket.on("topBidsUpdated", (data) => setTopBids(data.topBids || []));

    // Fetch initial data
    newSocket.emit(
      "getCurrentBid",
      { auctionId: "68e7d370af6b023b9c3f1cc5" },
      (res) => {
        if (res.success) {
          setCurrentBidPlayer(res.currentBidData || {});
          setTimerEnd(res.currentBid?.timerEnd || Date.now() + 5 * 60 * 1000);
        }
      }
    );

    newSocket.emit("getBidHistory", { playerId }, (res) => {
      if (res.success) {
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
}, [])
  const value = {
    // placeBid,
    // currentWinningBid,
    // bidHistory,
    // currentPlayerBidHistory,
    // usersConnected,
    // findTotalUsersConnected,
    // navigate,
    socket,
    setCookie,
    getCookie,
    userName, setUserName, role, setRole, teamId, setTeamId,placeBid,currentBidPlayer, topBids,bidHistory, timerEnd, remainingBudget

  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
