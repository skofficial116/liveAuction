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

      // Transform the shape to match what your transformApiToAuctions expects
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

export const createAuction = async (req, res) => {
  const session = await mongoose.startSession();
  let transactionActive = false;

  try {
    session.startTransaction();
    transactionActive = true;

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