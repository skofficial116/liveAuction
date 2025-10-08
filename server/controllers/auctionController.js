import User from "../models/User.js";
import Team from "../models/Team.js";
import Player from "../models/Player.js";
import Sport from "../models/Sport.js";
import Auction from "../models/Auction.js";
import AuctionSet from "../models/AuctionSet.js";
import Bid from "../models/Bid.js";
import mongoose from "mongoose";
// import Notification from "../models/Notification.js";

// export async function placeBid(data) {
//   try {
//     const { playerId, teamId, auctionId, bidAmount } = data;
//     //find the player
//     const player = await Player.findById(playerId);
//     if (!player) {
//       throw new Error("Player not found");
//     }

//     //find the team
//     const team = await Team.findById(teamId);
//     if (!team) {
//       throw new Error("Team not found");
//     }

//     if (team.maxBid < bidAmount) {
//       throw new Error("Insufficient budget to place this bid");
//     }

//     // find the auction
//     const auction = await Auction.findOne({ _id: auctionId });
//     if (!auction) {
//       throw new Error("No auction found");
//     }
//     // find and replace all the previous bid status to outbid
//     await Bid.updateMany(
//       { player: playerId, isWinning: true, auction: auctionId },
//       { $set: { isWinning: false, status: "outbid" } }
//     );

//     // create a new bid
//     const newBid = new Bid({
//       auction: auctionId,
//       player: playerId,
//       team: teamId,
//       amount: bidAmount,
//     });
//     if (newBid) {
//       throw new Error("Error in creating the Bid");
//     }

//     await newBid.save();
//     await player.updateCurrentBid(teamId, bidAmount);

//     return { success: true, message: "Bid Placed Successfully" };
//   } catch (error) {
//     throw new Error(`Error in placing a new Bid: ${error.message}`);
//   }
// }

// export async function bidHistory(playerId, auctionId) {
//   // console.log("Querying for:", { playerId, auctionId });
//   //  console.log(await Bid.findOne());
//   const _playerId = new mongoose.Types.ObjectId(playerId);
//   const _auctionId = new mongoose.Types.ObjectId(auctionId);
//   // Fetch all bids for the player in the auction, sorted by amount descending, sending only necessary fields such as amount, team, timestamp
//   const bidsRaw = await Bid.find(
//     {
//       player: _playerId,
//       auction: _auctionId,
//     },
//     { amount: 1, team: 1, timestamp: 1 }
//   )
//     .sort({ amount: -1 })
//     .populate("team", "name -_id");
//   // console.log(bidsRaw);
//   const bids = bidsRaw.map((bid) => ({
//     amount: bid.amount,
//     timestamp: bid.timestamp,
//     teamName: bid.team?.name || null, // use optional chaining in case team is null
//   }));
//   return bids;
// }

export const getAllTeams = async (req, res) => {
  try {
    const teamFields = {
      name: true,
      secret: false,
      players: true,
      maxPlayers: true,
      minPlayers: true,
      budget: true,
      createdAt: false,
      updatedAt: false,
      __v: false,
      short: true,
      color: true,
    };
    const playerFields = {
      name: true,
      sport: false,
      basePrice: true,
      currentBid: false,

      auctionSet: false,
      attributes: true,
      createdAt: false,
      updatedAt: false,
      "sold.price": true,
      "sold.soldAt": true,
      __v: false,
    };

    const sportFields = {
      name: false,
      description: false,
    };

    function buildSelectString(config) {
      return Object.keys(config)
        .filter((key) => config[key])
        .join(" ");
    }
    let auctionId = req.auctionId || "68e167ecabc39f77566bfbe4";
    const teams = await Team.find({ auction: auctionId })
      .select(buildSelectString(teamFields))
      .populate({
        path: "players",
        select: buildSelectString(playerFields),
        populate: {
          path: "auctionSet",
          select: "name -_id", // only get auction set name
        },
      });

    // console.log(JSON.stringify(teams, null, 2));
    const output = teams.map((team) => {
      const players = team.players.map((player) => {
        const filteredAttributes = player.attributes.map((attr) => ({
          name: attr.name,
          displayName: attr.displayName,
          type: attr.type,
          defaultValue: attr.defaultValue,
        }));

        return {
          ...player.toObject(),
          attributes: filteredAttributes,
        };
      });

      return {
        ...team.toObject(),
        players,
      };
    });

    res.json({ success: true, output });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllPlayers = async (req, res) => {
  try {
    const auctionId = req.auctionId || "68e167ecabc39f77566bfbe4";

    const players = await Player.find({ auction: auctionId })
      .select("-currentBid -sport -_id -auction")
      .populate({
        path: "auctionSet",
        select: "-_id name",
      })
      .populate({
        path: "sold.team",
        select: "name -_id",
      })
      .lean(); // converts Mongoose docs to plain JS objects (lets us edit safely)

    // Ensure sold structure is always consistent
    const normalizedPlayers = players.map((player) => {
      if (!player.sold) {
        player.sold = { isSold: false };
      } else if (!player.sold.isSold) {
        player.sold = { isSold: false }; // remove any leftover empty team or price fields
      }
      return player;
    });

    console.log(auctionId, ": AuctionId");
    res.json({ success: true, players: normalizedPlayers });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getMyTeam = async (req, res) => {
  const playerFields = {
    name: true,
    sport: false,
    basePrice: true,
    currentBid: false,
    auctionSet: false,
    attributes: true,
    createdAt: false,
    updatedAt: false,
    "sold.price": true,
    "sold.soldAt": true,
    __v: false,
  };
  function buildSelectString(config) {
    return Object.keys(config)
      .filter((key) => config[key])
      .join(" ");
  }
  try {
    const myTeamId = req.myTeamId || "68e167ecabc39f77566bfbde";
    const myTeamSecret = req.myTeamSecret || "team1secret";

    let team = await Team.findById(myTeamId);
    if (!team) {
      console.log("Team not found.");
      res.send({ success: false, message: "Team not found." });
    }
    // console.log(team)
    if (team.secret !== myTeamSecret) {
      res.send({ success: false, message: "Invalid Secret" });
    }
    team = await Team.find({ _id: myTeamId })
      .select("-secret -_id")
      .populate({
        path: "players",
        select: buildSelectString(playerFields),
        populate: {
          path: "auctionSet",
          select: "name -_id", // only get auction set name
        },
      });
    res.send({ success: true, myTeam: team });
  } catch (error) {
    console.log(error.message);
    res.send({ success: false, message: error.message });
  }
};

// export const
