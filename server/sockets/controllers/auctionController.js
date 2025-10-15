// socket/controllers/auctionController.js
import Bid from "../../models/Bid.js";
import Player from "../../models/Player.js";
import CurrentBid from "../../models/CurrentBid.js";
import Team from "../../models/Team.js";
import mongoose from "mongoose";

/**
 * 1️⃣ CURRENT BID — fetch latest bid for a player
 */
// socket/controllers/auctionController.js or a separate memory store
const auctionTimers = new Map(); // key: playerId, value: timestamp in ms
const AUCTION_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export const startPlayerAuctionTimer = (playerId) => {
  if (!auctionTimers.has(playerId)) {
    auctionTimers.set(playerId, Date.now() + AUCTION_DURATION_MS);
  }
};

export const getCurrentBid = async (io, socket, data, callback) => {
  try {
    const { auctionId } = data;
    // console.log(auctionId);
    const currentBidData = await CurrentBid.findOne({ auction: auctionId })
      .select("auction player team amount")
      .populate({path: "player", select:"name basePrice attributes auctionSet", populate:{
        path:"auctionSet",
        select:"name"
      }})
      .populate("team", "short name color")
      .lean();
    // console.log(currentBidData);
    
    if (callback) callback({ success: true, currentBidData });
  } catch (err) {
    console.error("getCurrentBid error:", err);
    if (callback) callback({ success: false, message: err.message });
  }
};

/**
 * 2️⃣ BID HISTORY — fetch all bids for a player
 */
export const getBidHistory = async (io, socket, data, callback) => {
  try {
    const { playerId } = data;

    const bids = await Bid.find({ player: playerId })
      .populate("team", "name color short")
      .sort({ amount: -1 });
    const bidHistory = bids.map((b, idx) => ({
      id: idx + 1,
      amount: b.amount,
      team: {
        teamName: b.team?.name || "-",
        color: b.team.color,
        short: b.team.short,
      },
      timestamp: b.timestamp.getTime(),
      // JS timestamp in ms
    }));
    if (callback) callback({ success: true, bids: bidHistory });
  } catch (err) {
    console.error("getBidHistory error:", err);
    if (callback) callback({ success: false, message: err.message });
  }
};

/**
 * 3️⃣ TOP 3 BIDS — fetch top 3 highest bids for a player
 */

export const getTop3Bids = async (socket, data) => {
  try {
    // const { auctionId } = data;
    const auctionId = "68e167ecabc39f77566bfbe4";

    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
      return socket.emit("topBidsUpdated", {
        success: false,
        message: "Invalid auctionId",
      });
    }

    // Step 1: Get all players in this auction
    const players = await Player.find({ auction: auctionId });

    const bidsWithWinning = await Bid.find({ status: "won" })
      .populate({
        path: "player",
        select: "-_id name sold.soldAt",
      })
      .populate({
        path: "team",
        select: "-_id name short color",
      })
      .sort({ amount: -1 })
      .limit(3)
      .lean({ virtuals: false })
      .select("-createdAt -updatedAt -__v -isWinning -status -timestamp");

    socket.emit("topBidsUpdated", { success: true, topBids: bidsWithWinning });
  } catch (err) {
    console.error("getTop3Bids error:", err);
    socket.emit("topBidsUpdated", { success: false, message: err.message });
  }
};

