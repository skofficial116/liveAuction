// socket/controllers/auctionController.js
import Bid from "../../models/Bid.js";
import Player from "../../models/Player.js";
import Team from "../../models/Team.js";

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

    const player = await Player.findById(playerId)
      .populate("currentBid.team", "name") // populate team name
      .populate("auctionSet", "name"); // optional if you need auction set name

    if (!player) throw new Error("Player not found");
startPlayerAuctionTimer(playerId);

    const timerEnd = auctionTimers.get(playerId);
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
      currentBid: player.currentBid?.amount || player.basePrice,
      leadingTeam: player.currentBid?.team?.name || null,
      auctionSet: player.auctionSet?.name || null,
      basePrice: player.basePrice,
      specialty:
        player.attributes.find((a) => a.name === "specialty")?.defaultValue ||
        "-", timerEnd
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
      .populate("team", "name")
      .sort({ createdAt: -1 });

    const bidHistory = bids.map((b, idx) => ({
      id: idx + 1,
      amount: b.amount,
      team: b.team?.name || "-",
      timestamp: b.timestamp.getTime(), // JS timestamp in ms
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
export const getTop3Bids = async (io, socket, data, callback) => {
  try {
    const { auctionId } = data;

    // Find sold players in the auction
    const soldPlayers = await Player.find({
      auction: auctionId,
      "sold.isSold": true,
    }).populate("sold.team", "name");

    // Get the highest bid for each sold player
    const topBidsFormatted = soldPlayers
      .map((player) => ({
        playerName: player.name,
        amount: player.sold.price,
        team: player.sold.team?.name || "-",
        country:
          player.attributes.find((a) => a.name === "country")?.defaultValue ||
          "-",
        specialty:
          player.attributes.find((a) => a.name === "specialty")?.defaultValue ||
          "-",
      }))
      .sort((a, b) => b.amount - a.amount) // descending by amount
      .slice(0, 6) // top 6 sold players

      .map((b, idx) => ({ id: idx + 1, ...b })); // add id field

    if (callback) callback({ success: true, topBids: topBidsFormatted });
  } catch (err) {
    console.error("getTop3Bids error:", err);
    if (callback) callback({ success: false, message: err.message });
  }
};
