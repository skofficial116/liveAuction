import mongoose from "mongoose";
import Auction from "../models/Auction.js";
import AuctionSet from "../models/AuctionSet.js";
import Team from "../models/Team.js";
import Player from "../models/Player.js";
import Sport from "../models/Sport.js";
import User from "../models/User.js";

// Utility to generate consistent ObjectIds
const genId = (hex) => new mongoose.Types.ObjectId(hex.padEnd(24, "0"));

const seedCricketAuction = async () => {
  try {
    // 1. Sport
    const sportId = genId("1001");
    const sport = await Sport.findOneAndUpdate(
      { name: "Cricket" },
      { name: "Cricket", description: "International T20 Cricket" },
      { upsert: true, new: true }
    );

    // 2. Admin User
    const adminId = genId("2001");
    const admin = await User.findOneAndUpdate(
      { username: "admin" },
      {
        username: "admin",
        email: "admin@example.com",
        password: "password123",
        role: "admin",
      },
      { upsert: true, new: true }
    );

    // 3. Teams
    const teamData = [
      { _id: genId("3001"), name: "Thunderbolts", secret: "secret1" },
      { _id: genId("3002"), name: "Firehawks", secret: "secret2" },
      { _id: genId("3003"), name: "Ice Kings", secret: "secret3" },
      { _id: genId("3004"), name: "Storm Riders", secret: "secret4" },
    ];

    const teams = [];
    for (const t of teamData) {
      const team = await Team.findOneAndUpdate(
        { name: t.name },
        {
          name: t.name,
          secret: t.secret,
          budget: 500,
          minPlayers: 11,
          maxPlayers: 15,
          basePriceForPlayers: 10,
          players: [],
        },
        { upsert: true, new: true }
      );
      teams.push(team);
    }

    // 4. Auction
    const auctionId = genId("4001");
    const auction = await Auction.findOneAndUpdate(
      { name: "Indian Premier T20 Auction" },
      {
        _id: auctionId,
        name: "Indian Premier T20 Auction",
        description: "Live auction for IPL style T20 cricket league",
        startTime: new Date(),
        status: "scheduled",
        sport: sport._id,
        teams: teams.map((t) => t._id),
        createdBy: admin._id,
        credentials: {
          admin: { id: "admin_id", secret: "admin_secret" },
          teams: teams.map((t, idx) => ({
            team: t._id,
            teamId: `T00${idx + 1}`,
            secret: t.secret,
          })),
        },
        settings: {
          initialBudget: 500,
          minBidIncrement: 10,
          bidTimeLimit: 30,
          timeExtensionDuration: 30,
          maxTimeExtensions: 3,
        },
      },
      { upsert: true, new: true }
    );

    // 5. Auction Sets and Players
    const setNames = ["A", "B", "C"];
    const sets = [];

    for (let i = 0; i < setNames.length; i++) {
      const setId = genId(`500${i + 1}`);
      const playerIds = [];

      for (let j = 1; j <= 5; j++) {
        const playerId = genId(`6${i + 1}0${j}`);
        const playerName = `Player_${setNames[i]}${j}`;
        const player = await Player.findOneAndUpdate(
          { name: playerName },
          {
            _id: playerId,
            name: playerName,
            sport: sport._id,
            basePrice: 10,
            auctionSet: setId,
            sold: { isSold: false },
            currentBid: { amount: 0 },
          },
          { upsert: true, new: true }
        );
        playerIds.push(player._id);
      }

      const auctionSet = await AuctionSet.findOneAndUpdate(
        { name: `Set ${setNames[i]}` },
        {
          _id: setId,
          name: `Set ${setNames[i]}`,
          sport: sport._id,
          auction: auction._id,
          players: playerIds,
          order: i + 1,
          status: "upcoming",
        },
        { upsert: true, new: true }
      );

      sets.push(auctionSet);
    }

    // Update auction sets reference
    auction.sets = sets.map((s) => s._id);
    await auction.save();

    console.log("Cricket auction seeded successfully");
    console.log("Auction ID:", auction._id);
  } catch (err) {
    
    console.error("Seeding error:", err);
  }
};

export default seedCricketAuction;
