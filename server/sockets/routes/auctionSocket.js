// socket/routes/auctionSocket.js
// import { handleBid, handleJoinAuction } from "../controllers/auctionController.js";

// socket/routes/auctionSocket.js
import {
  getCurrentBid,
  getBidHistory,
  getTop3Bids,
} from "../controllers/auctionController.js";

export default function auctionSocket(io, socket) {
  // Fetch current bid for a player
  socket.on("getCurrentBid", async (data, callback) =>
    getCurrentBid(io, socket, data, callback)
  );

  // Fetch all bid history for a player
  socket.on("getBidHistory", async (data, callback) =>
    getBidHistory(io, socket, data, callback)
  );

  // Fetch top 3 bids for a player
  socket.on("getTop3Bids", async (data, callback) =>
    getTop3Bids(io, socket, data, callback)
  );
  
}
