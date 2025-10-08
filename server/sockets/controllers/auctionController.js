// socket/controllers/auctionController.js
import Bid from "../../models/Bid.js";
import Player from "../../models/Player.js";
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
    const { playerId } = data;

    // 1️⃣ Fetch player details
    const player = await Player.findById(playerId).populate(
      "auctionSet",
      "name"
    );

    const totalBids = await Bid.find({player:playerId})

    if (!player) throw new Error("Player not found");

    // 2️⃣ Fetch latest winning bid from Bid model
    const winningBid = await Bid.findOne({
      player: playerId,
      status: "winning",
    })
      .populate("team", "name short color") // populate team info
      .sort({ amount: -1 });

    // 3️⃣ Start auction timer
    startPlayerAuctionTimer(playerId);
    const timerEnd = auctionTimers.get(playerId);


    // 4️⃣ Prepare response
    const currentBidData = {
      name: player.name,
      country:
        player.attributes.find((a) => a.name === "country")?.defaultValue ||
        "-",
      odRating:
        player.attributes.find((a) => a.name === "ODRating")?.defaultValue || 0,
      t20Rating:
        player.attributes.find((a) => a.name === "T20Rating")?.defaultValue ||
        0,
      currentBid: winningBid?.amount || player.basePrice,
      leadingTeam: winningBid?.team?.name || null,
      auctionSet: player.auctionSet?.name || null,
      basePrice: player.basePrice,
      specialty:
        player.attributes.find((a) => a.name === "specialty")?.defaultValue ||
        "-",
      timerEnd,
      
      color: winningBid?.team?.color || "#ccc",
    };
    if (callback) callback({ success: true, currentBid: currentBidData });
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
    const auctionId = "68e167ecabc39f77566bfbe4"

    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
      return socket.emit("topBidsUpdated", {
        success: false,
        message: "Invalid auctionId",
      });
    }

    // Step 1: Get all players in this auction
    const players = await Player.find({ auction: auctionId });

    const bidsWithWinning = await Bid.find({status:"won"}).populate({
        path:"player", select:"-_id name sold.soldAt"
      
    }).populate({
        path:"team", select:"-_id name short color"
    }).sort({amount:-1}).limit(3).lean({virtuals:false}).select("-createdAt -updatedAt -__v -isWinning -status -timestamp")


    socket.emit("topBidsUpdated", { success: true, topBids:bidsWithWinning });
  } catch (err) {
    console.error("getTop3Bids error:", err);
    socket.emit("topBidsUpdated", { success: false, message: err.message });
  }
};
