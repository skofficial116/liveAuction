import mongoose from "mongoose";
import User from "./models/User.js";
import Team from "./models/Team.js";
import Sport from "./models/Sport.js";
import Player from "./models/Player.js";
import Bid from "./models/Bid.js";
import Auction from "./models/Auction.js";
import AuctionSet from "./models/AuctionSet.js";
const MONGO_URI =
  "mongodb+srv://sachinAdmin:skofficial116@college4sem.t10io.mongodb.net/auctiondb"; // adjust as needed

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to DB");

    // Cleanup
    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Sport.deleteMany({}),
      Player.deleteMany({}),
      Bid.deleteMany({}),
      Auction.deleteMany({}),
      AuctionSet.deleteMany({}),
    ]);

    // 1. Sport
    const cricket = await Sport.create({
      name: "Cricket",
      description: "Cricket sport",
    });

    // 2. Admin
    const admin = await User.create({
      username: "admin1",
      email: "admin@test.com",
      password: "password123",
      role: "admin",
    });

    // 3. Teams
    const teams = await Team.insertMany([
      { name: "Mumbai Masters", secret: "team1secret", budget: 1000 },
      { name: "Delhi Dynamos", secret: "team2secret", budget: 1000 },
      { name: "Chennai Challengers", secret: "team3secret", budget: 1000 },
      { name: "Kolkata Kings", secret: "team4secret", budget: 1000 },
    ]);

    // 4. Auction
    const auction = await Auction.create({
      name: "Premier Cricket Auction",
      description: "Main 2025 cricket auction",
      startTime: new Date(),
      sport: cricket._id,
      createdBy: admin._id,
      teams: teams.map((t) => t._id),
      credentials: {
        admin: { id: "admin001", secret: "adminSecret" },
        teams: teams.map((t, idx) => ({
          team: t._id,
          teamId: `T${idx + 1}`,
          secret: `secret${idx + 1}`,
        })),
      },
    });
    await  Team.updateMany({}, {
      $set:{
        auction:auction._id
      }
    })

    // 5. Auction Sets
    const sets = await AuctionSet.insertMany([
      { name: "Set A", sport: cricket._id, auction: auction._id, order: 1 },
      { name: "Set B", sport: cricket._id, auction: auction._id, order: 2 },
      { name: "Set C", sport: cricket._id, auction: auction._id, order: 3 },
      { name: "Set D", sport: cricket._id, auction: auction._id, order: 4 },
    ]);

    auction.sets = sets.map((s) => s._id);
    await auction.save();

    // 6. Players
    // 6. Players
    const playersData = [];
    for (let i = 1; i <= 15; i++) {
      const setIndex = Math.floor((i - 1) / 4);
      playersData.push({
        name: `Player ${i}`,
        sport: cricket._id,
        auction:auction._id,
        basePrice: 50,
        auctionSet: sets[setIndex]._id,
        attributes: [
          {
            name: "odRating",
            displayName: "ODI Rating",
            type: "number",
            min: 0,
            max: 100,
            required: true,
            defaultValue: Math.floor(Math.random() * 41) + 60, // 60–100
            order: 1,
          },
          {
            name: "t20Rating",
            displayName: "T20 Rating",
            type: "number",
            min: 0,
            max: 100,
            required: true,
            defaultValue: Math.floor(Math.random() * 41) + 60, // 60–100
            order: 2,
          },
        ],
      });
    }
    const players = await Player.insertMany(playersData);

    // Assign players to sets
    for (let i = 0; i < sets.length; i++) {
      sets[i].players = players
        .filter((_, idx) => Math.floor(idx / 4) === i)
        .map((p) => p._id);
      await sets[i].save();
    }

    // 7. Bids & team assignment
    // Only assign **1 player per team** via winning bid
    // Player 5 will be ongoing winning
    const purchasedTeams = new Set(); // track teams that got a purchased player
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      const bidCount = Math.floor(Math.random() * 2) + 5; // 5–6 bids
      let amount = player.basePrice;
      const bids = [];
      const baseTime = new Date();
      baseTime.setMinutes(baseTime.getMinutes() - bidCount * 2);

      for (let b = 0; b < bidCount; b++) {
        amount += 10;
        const biddingTeam = teams[b % teams.length];
        const bidTime = new Date(baseTime.getTime() + b * 60 * 1000);

        bids.push({
          auction: auction._id,
          player: player._id,
          team: biddingTeam._id,
          amount,
          timestamp: bidTime,
          status: "outbid",
          isWinning: false,
        });
      }

      const createdBids = await Bid.insertMany(bids);
      const lastBid = createdBids[createdBids.length - 1];

      if (i === 4) {
        // Player 5 → ongoing winning bid
        for (let j = 0; j < createdBids.length - 1; j++) {
          await Bid.findByIdAndUpdate(createdBids[j]._id, {
            status: "outbid",
            isWinning: false,
          });
        }
        await Bid.findByIdAndUpdate(lastBid._id, {
          status: "winning",
          isWinning: true,
        });
        await player.updateCurrentBid(lastBid.team, lastBid.amount);
        // Not assigned to any team
      } else {
        // Last bid → won
        for (let j = 0; j < createdBids.length - 1; j++) {
          await Bid.findByIdAndUpdate(createdBids[j]._id, {
            status: "outbid",
            isWinning: false,
          });
        }
        await Bid.findByIdAndUpdate(lastBid._id, {
          status: "won",
          isWinning: true,
        });
        await player.markAsSold(lastBid.team, lastBid.amount);

        // Assign to **team only if team doesn't already have a purchased player**
        const team = teams.find((t) => !purchasedTeams.has(String(t._id)));
        if (team) {
          team.players = [player._id]; // only 1 player
          team.budget -= lastBid.amount;
          await team.save();
          purchasedTeams.add(String(team._id));
        }
      }
    }

   

    console.log(
      "✅ Seed data inserted correctly: 15 players, 1 player per team, 1 ongoing winning bid"
    );
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seed();
