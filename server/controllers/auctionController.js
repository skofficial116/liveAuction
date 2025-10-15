import User from "../models/User.js";
import Team from "../models/Team.js";
import Player from "../models/Player.js";
import Sport from "../models/Sport.js";
import Auction from "../models/Auction.js";
import AuctionSet from "../models/AuctionSet.js";
import Bid from "../models/Bid.js";
import mongoose from "mongoose";
import CurrentBid from "../models/CurrentBid.js";
import util from "util";
import Attribute from "../models/Attribute.js";

import crypto from "crypto";
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

// const frontendAuctionData = {
//   name: "ipl",
//   shortDesc: "dafdfhfg",
//   detailedDesc: "dfsgehrtjngnf",
//   startDate: "2025-10-16T01:34",
//   timePerBid: 30,
//   status: "draft",
//   teams: [
//     {
//       id: 1760471271433,
//       name: "RCB",
//       short: "RCB",
//       budget: 100000000,
//       color: "#FF6B6B",
//       slogan: "Play Bold",
//       players: [],
//     },
//   ],
//   attributes: [
//     {
//       id: 1760468604862,
//       name: "t20",
//       isPrimary: true,
//       defaultValue: "10",
//       type: "int",
//       options: [],
//     },
//     {
//       id: 1760468625615,
//       name: "od",
//       isPrimary: true,
//       defaultValue: "10",
//       type: "int",
//       options: [],
//     },
//     {
//       id: 1760471956241,
//       name: "City",
//       isPrimary: false,
//       defaultValue: "BLR",
//       type: "select",
//       options: ["BLR", "CSK", "Mumbai"],
//     },
//   ],
//   players: [
//     {
//       name: "VK",
//       auction: null,
//       basePrice: 10,
//       attributes: [
//         {
//           attributeId: 1760468604862,
//           name: "t20",
//           description: "",
//           typeOf: "int",
//           options: [],
//           defaultValue: "10",
//           value: "10",
//         },
//         {
//           attributeId: 1760468625615,
//           name: "od",
//           description: "",
//           typeOf: "int",
//           options: [],
//           defaultValue: "10",
//           value: "10",
//         },
//         {
//           attributeId: 1760471956241,
//           name: "City",
//           description: "",
//           typeOf: "select",
//           options: ["BLR", "CSK", "Mumbai"],
//           defaultValue: "BLR",
//           value: "BLR",
//         },
//       ],
//     },
//     {
//       name: "Rohit",
//       auction: null,
//       basePrice: 10,
//       attributes: [
//         {
//           attributeId: 1760468604862,
//           name: "t20",
//           description: "",
//           typeOf: "int",
//           options: [],
//           defaultValue: "10",
//           value: "10",
//         },
//         {
//           attributeId: 1760468625615,
//           name: "od",
//           description: "",
//           typeOf: "int",
//           options: [],
//           defaultValue: "10",
//           value: "10",
//         },
//         {
//           attributeId: 1760471956241,
//           name: "City",
//           description: "",
//           typeOf: "select",
//           options: ["BLR", "CSK", "Mumbai"],
//           defaultValue: "BLR",
//           value: "BLR",
//         },
//       ],
//     },
//   ],
//   auctionSets: [
//     {
//       id: 1760468595607,
//       name: "",
//       players: [1760468640207],
//       order: "randomized",
//     },
//   ],
//   basePrice: 50,
//   // id: 1760472624025
// };

export const createAuction = async (req, res) => {
  const session = await mongoose.startSession();
  let transactionActive = false;

  try {
    session.startTransaction();
    transactionActive = true;
    console.log("Entered Create Auction")

    const frontendAuctionData = req.body;

    // 1️⃣ Find or create user
    let user = await User.findOne({ username: "Sachin Test" }).session(session);
    if (!user) {
      user = await User.create(
        [
          {
            username: "Sachin Test",
            email: "sachin@test.com",
            password: "password123",
            role: "admin",
          },
        ],
        { session }
      );
      user = user[0];
    }

    const userId = user._id;

    // 2️⃣ Find or create sport
    let sport = await Sport.findOne({ name: "cricket" }).session(session);
    if (!sport) {
      sport = (
        await Sport.create(
          [{ name: "cricket", description: "Cricket sport" }],
          { session }
        )
      )[0];
    }

    // 3️⃣ Find or create auction
    let auction = await Auction.findOne({ name: frontendAuctionData.name }).session(session);
    const isNewAuction = !auction;

    if (!auction) {
      auction = new Auction({
        name: frontendAuctionData.name,
        createdBy: userId,
        sport: sport._id,
        credentials: {
          admin: {
            id: crypto.randomUUID(),
            secret: crypto.randomBytes(16).toString("hex"),
          },
        },
      });
    }

    auction.shortDescription = frontendAuctionData.shortDesc;
    auction.longDescription = frontendAuctionData.detailedDesc;
    auction.startTime = new Date(frontendAuctionData.startDate);
    auction.startDime = new Date(frontendAuctionData.startDate);
    auction.status = frontendAuctionData.status || "draft";
    auction.settings = { bidTimeLimit: frontendAuctionData.timePerBid || 30 };

    await auction.save({ session });

    // 4️⃣ Upsert Attributes
    const existingAttrs = await Attribute.find({ auction: auction._id }).session(session);
    const attrMap = {};

    for (const attr of frontendAuctionData.attributes) {
      let dbAttr = existingAttrs.find((a) => a.name === attr.name);
      const value = attr.type === "int" ? parseInt(attr.defaultValue) : attr.defaultValue;

      if (dbAttr) {
        dbAttr.typeOf = attr.type;
        dbAttr.default = value;
        dbAttr.options = attr.options || [];
        await dbAttr.save({ session });
      } else {
        dbAttr = (
          await Attribute.create(
            [
              {
                auction: auction._id,
                name: attr.name,
                typeOf: attr.type,
                default: value,
                options: attr.options || [],
              },
            ],
            { session }
          )
        )[0];
      }
      attrMap[attr.name] = dbAttr._id;
    }

    // Delete removed attributes
    const attrIdsToDelete = existingAttrs
      .filter((a) => !frontendAuctionData.attributes.find((fa) => fa.name === a.name))
      .map((a) => a._id);

    if (attrIdsToDelete.length) {
      await Attribute.deleteMany({ _id: { $in: attrIdsToDelete }, auction: auction._id }, { session });
    }

    // 5️⃣ Upsert Teams
    const existingTeams = await Team.find({ auction: auction._id }).session(session);
    const teamMap = {};

    for (const t of frontendAuctionData.teams) {
      let dbTeam = existingTeams.find((team) => team.name === t.name);

      if (dbTeam) {
        dbTeam.short = t.short;
        dbTeam.color = t.color;
        dbTeam.slogan = t.slogan;
        dbTeam.budget = t.budget;
        await dbTeam.save({ session });
      } else {
        dbTeam = (
          await Team.create(
            [
              {
                name: t.name,
                short: t.short,
                color: t.color,
                slogan: t.slogan,
                budget: t.budget,
                auction: auction._id,
                secret: crypto.randomUUID(),
              },
            ],
            { session }
          )
        )[0];
      }
      teamMap[t.name] = dbTeam._id;
    }

    const teamIdsToDelete = existingTeams
      .filter((t) => !frontendAuctionData.teams.find((ft) => ft.name === t.name))
      .map((t) => t._id);

    if (teamIdsToDelete.length) {
      await Team.deleteMany({ _id: { $in: teamIdsToDelete }, auction: auction._id }, { session });
    }

    // 6️⃣ Upsert Players
    const existingPlayers = await Player.find({ auction: auction._id }).session(session);
    const playerMap = {};

    for (const p of frontendAuctionData.players) {
      let dbPlayer = existingPlayers.find((pl) => pl.name === p.name);

      const playerAttributes = p.attributes.map((a) => ({
        attributeId: attrMap[a.name],
        name: a.name,
        value: a.value,
      }));

      if (dbPlayer) {
        dbPlayer.basePrice = p.basePrice;
        dbPlayer.attributes = playerAttributes;
        await dbPlayer.save({ session });
      } else {
        dbPlayer = (
          await Player.create(
            [
              {
                name: p.name,
                sport: sport._id,
                auction: auction._id,
                basePrice: p.basePrice,
                attributes: playerAttributes,
              },
            ],
            { session }
          )
        )[0];
      }
      playerMap[p.name] = dbPlayer._id;
    }

    const playerIdsToDelete = existingPlayers
      .filter((p) => !frontendAuctionData.players.find((fp) => fp.name === p.name))
      .map((p) => p._id);

    if (playerIdsToDelete.length) {
      await Player.deleteMany({ _id: { $in: playerIdsToDelete }, auction: auction._id }, { session });
    }

    // 7️⃣ Upsert Auction Sets
    const existingSets = await AuctionSet.find({ auction: auction._id }).session(session);

    for (const s of frontendAuctionData.auctionSets) {
      let dbSet = existingSets.find((set) => set.name === s.name);
      const setPlayerIds = (s.players || []).map((pName) => playerMap[pName]).filter(Boolean);

      if (dbSet) {
        dbSet.name = s.name || dbSet.name;
        dbSet.players = setPlayerIds;
        dbSet.order = s.order || dbSet.order;
        await dbSet.save({ session });
      } else {
        dbSet = (
          await AuctionSet.create(
            [
              {
                name: s.name || "Set 1",
                auction: auction._id,
                players: setPlayerIds,
                order: s.order || "randomized",
                status: "draft",
              },
            ],
            { session }
          )
        )[0];
      }
    }

    const setIdsToDelete = existingSets
      .filter((set) => !frontendAuctionData.auctionSets.find((fs) => fs.name === set.name))
      .map((set) => set._id);

    if (setIdsToDelete.length) {
      await AuctionSet.deleteMany({ _id: { $in: setIdsToDelete }, auction: auction._id }, { session });
    }

    // 8️⃣ Commit transaction
    await session.commitTransaction();
    transactionActive = false;
    session.endSession();

    return res.send({
      success: true,
      message: isNewAuction ? "Auction created successfully" : "Auction updated successfully",
      auctionId: auction._id,
    });
  } catch (error) {
    if (transactionActive) {
      await session.abortTransaction();
    }
    session.endSession();
    console.error("Error in createAuction:", error);
    return res.status(500).send({ success: false, message: "Auction creation failed", error: error.message });
  }
};

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

    // console.log(auctionId, ": AuctionId");
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

export const getAuctionProfile = async (req, res) => {
  try {
    const auctionId = req.params.id;
    const auctionData = await Auction.findById(auctionId)
      .select("name  description credentials status settings teams")
      .populate({ path: "sets", select: "name " })
      .populate({ path: "teams", select: "name budget short color slogan" })
      .lean({ virtuals: false });
    // console.log(auctionData);
    // console.log(JSON.stringify(auctionData, null, 2));

    res.send({ success: true, auctionData });
  } catch (error) {
    console.log(error.message);
    res.send({ success: false, message: error.message });
  }
};

export const getAllAuctions = async (req, res) => {
  try {
    const allAuctions = await Auction.find().select(
      "_id teams name description startTime"
    );
    // const allAuctions = await Auction.find().select("_id");

    res.send({ success: true, allAuctions });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};

export const placeBid = async (req, res) => {
  try {
    console.log(req.body);
    const user = JSON.parse(req.cookies.auctionUser);
    // console.log(user)

    if (user.role !== "captain") {
      return res.send({
        success: false,
        msg: "Only Captain can place the Bid",
      });
    }

    const team = await Team.findById(user.teamId).select("_id").lean();
    if (!team) return res.send({ success: false, msg: "Team Not Found" });

    const auction = await Auction.findById(req.body.auction)
      .select("_id")
      .lean();
    if (!auction) return res.send({ success: false, msg: "Auction Not Found" });

    const player = await Player.findById(req.body.player).select("_id");
    if (!player) return res.send({ success: false, msg: "Player Not Found" });

    if (!req.body.amount || req.body.amount <= 0) {
      return res.send({ success: false, msg: "Invalid bid amount" });
    }

    let currentBid = await CurrentBid.findOne({ auction: req.body.auction });

    if (!currentBid) {
      currentBid = await CurrentBid.create({
        player: player._id,
        auction: req.body.auction,
        team: team._id,
        amount: req.body.amount,
      });
    } else {
      if (req.body.amount <= currentBid.amount) {
        return res.send({
          success: false,
          msg: `Your bid must be higher than current bid of ${currentBid.amount}`,
        });
      }

      currentBid.player = player._id;
      currentBid.team = team._id;
      currentBid.amount = req.body.amount;
      await currentBid.save();
    }

    console.log("Current Bid: ", currentBid);
    res.send({
      success: true,
      msg: "Bid placed successfully. You are leading now",
    });
  } catch (error) {
    console.log(`Error at PlaceBid: ${error.message}`);
    res.send({ success: false, msg: `Error at PlaceBid: ${error.message}` });
  }
};

export const getAllAuctionsAdmin = async (req, res) => {
  try {
    const allAuctions = await Auction.find()
      .populate("teams")
      .populate({
        path: "sets",
        populate: {
          path: "players",
        },
      });
    // const allAuctions = await Auction.find().select(
    //   "_id teams name description startTime"
    // );
    // const allAuctions = await Auction.find().select("_id");

    res.send({ success: true, allAuctions });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};


export const getAuctionData = async (req, res) => {
  const { auctionId } = req.params;

  try {
    // 1️⃣ Fetch auction
    const auction = await Auction.findById(auctionId)
      .populate("sport")
      .populate("createdBy")
      .lean();

    if (!auction) {
      return res.status(404).send({ success: false, message: "Auction not found" });
    }

    // 2️⃣ Fetch related entities
    const [attributes, teams, players, auctionSets] = await Promise.all([
      Attribute.find({ auction: auction._id }).lean(),
      Team.find({ auction: auction._id }).lean(),
      Player.find({ auction: auction._id }).lean(),
      AuctionSet.find({ auction: auction._id }).lean(),
    ]);

    // 3️⃣ Map attributes
    const frontendAttributes = attributes.map((a) => ({
      id: a._id.toString(),
      name: a.name,
      isPrimary: false, // adjust if your schema tracks this
      defaultValue: a.default,
      type: a.typeOf,
      options: a.options || [],
    }));

    const attrMap = Object.fromEntries(frontendAttributes.map((a) => [a._id.toString(), a.name]));
    const attrDetailsMap = Object.fromEntries(frontendAttributes.map((a) => [a.name, a]));

    // 4️⃣ Map teams
    const frontendTeams = teams.map((t) => ({
      id: t._id.toString(),
      name: t.name,
      short: t.short,
      budget: t.budget,
      color: t.color,
      slogan: t.slogan,
      players: [], // Players are not directly tied to teams in your creation flow
    }));

    // 5️⃣ Map players
    const frontendPlayers = players.map((p) => ({
      name: p.name,
      auction: p.auction?.toString() || null,
      basePrice: p.basePrice,
      attributes: p.attributes.map((attr) => ({
        attributeId: attr.attributeId?.toString() || null,
        name: attr.name,
        description: "",
        typeOf: attrDetailsMap[attr.name]?.type || attr.typeOf || "string",
        options: attrDetailsMap[attr.name]?.options || [],
        defaultValue: attrDetailsMap[attr.name]?.defaultValue || "",
        value: attr.value,
      })),
    }));

    // 6️⃣ Map auction sets
    const frontendAuctionSets = auctionSets.map((set) => ({
      id: set._id.toString(),
      name: set.name,
      players: set.players.map((pId) => {
        const player = players.find((pl) => pl._id.toString() === pId.toString());
        return player ? player.name : null;
      }).filter(Boolean),
      order: set.order || "randomized",
    }));

    // 7️⃣ Construct frontend data object
    const frontendAuctionData = {
      name: auction.name,
      shortDesc: auction.shortDescription,
      detailedDesc: auction.longDescription,
      startDate: auction.startTime?.toISOString().slice(0, 16), // "YYYY-MM-DDTHH:mm"
      timePerBid: auction.settings?.bidTimeLimit || 30,
      status: auction.status || "draft",
      teams: frontendTeams,
      attributes: frontendAttributes,
      players: frontendPlayers,
      auctionSets: frontendAuctionSets,
      basePrice: 50, // static or configurable
      id: auction._id.toString(),
    };

    return res.send({
      success: true,
      message: "Auction data fetched successfully",
      data: frontendAuctionData,
    });

  } catch (error) {
    console.error("Error in getAuctionData:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to fetch auction data",
      error: error.message,
    });
  }
};


export const getAllAuctionsMeta = async (req, res) => {
  try {
    // Fetch all auctions (minimal fields)
    const auctions = await Auction.find({})
      .select("name status shortDescription longDescription startTime settings sport")
      .lean();

    const allAuctions = [];

    for (const auction of auctions) {
      // Fetch related small data
      const [teams, sets] = await Promise.all([
        Team.find({ auction: auction._id })
          .select("name short color slogan budget")
          .lean(),
        AuctionSet.find({ auction: auction._id })
          .populate({
            path: "players",
            model: "Player",
            select: "name basePrice attributes sold",
          })
          .lean(),
      ]);

      
      allAuctions.push({
        _id: auction._id.toString(),
        name: auction.name,
        status: auction.status || "draft",
        description: auction.shortDescription || auction.longDescription || "",
        startTime: auction.startTime,
        settings: auction.settings || {},
        sport: auction.sport,
        teams,
        sets, // each set has players with attributes
      });
    }

    return res.status(200).send({
      success: true,
      allAuctions,
    });
  } catch (error) {
    console.error("Error in getAllAuctionsMeta:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to fetch auctions",
      error: error.message,
    });
  }
};
