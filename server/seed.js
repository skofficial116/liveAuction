import mongoose from "mongoose";
import User from "./models/User.js";
import Team from "./models/Team.js";
import Sport from "./models/Sport.js";
import Player from "./models/Player.js";
import Bid from "./models/Bid.js";
import Auction from "./models/Auction.js";
import AuctionSet from "./models/AuctionSet.js";

const MONGO_URI =
  "mongodb+srv://sachinAdmin:skofficial116@college4sem.t10io.mongodb.net/auctiondb";

const createAuctionData = async ({
  auctionName,
  teamCount,
  playerCount,
  admin,
  sport,
}) => {
  // 🏏 Create Teams with colors, slogans, and city-based names
  const cityTeamNames = [
    { city: "Mumbai", nickname: "Mavericks", short: "MM", color: "#0057B8", slogan: "Rise as One!" },
    { city: "Delhi", nickname: "Dynamos", short: "DD", color: "#DA291C", slogan: "Play Bold, Win Big!" },
    { city: "Chennai", nickname: "Chargers", short: "CC", color: "#FFD700", slogan: "Roar with Pride!" },
    { city: "Bangalore", nickname: "Blazers", short: "BB", color: "#E03C31", slogan: "Fuel the Fire!" },
    { city: "Kolkata", nickname: "Kings", short: "KK", color: "#5A2D81", slogan: "Rule the Game!" },
    { city: "Hyderabad", nickname: "Hawks", short: "HY", color: "#FF8200", slogan: "Soar Beyond Limits!" },
    { city: "Pune", nickname: "Panthers", short: "PP", color: "#007A33", slogan: "Fear None!" },
    { city: "Ahmedabad", nickname: "Titans", short: "AT", color: "#2E3192", slogan: "Unbreakable Spirit!" },
    { city: "Jaipur", nickname: "Rangers", short: "JR", color: "#ED1C24", slogan: "Together We Triumph!" },
    { city: "Lucknow", nickname: "Lions", short: "LL", color: "#0085CA", slogan: "Born to Lead!" },
  ];

  const teams = [];
  for (let i = 0; i < teamCount; i++) {
    const template = cityTeamNames[i % cityTeamNames.length];
    teams.push({
      name: `${template.city} ${template.nickname}`,
      short: template.short,
      color: template.color,
      slogan: template.slogan,
      secret: `${auctionName.toLowerCase()}team${i + 1}secret`,
      budget: 1000 + Math.floor(Math.random() * 500),
    });
  }

  const createdTeams = await Team.insertMany(teams);

  // ⚙️ Create Auction
  const auction = await Auction.create({
    name: auctionName,
    description: `${auctionName} for ${sport.name}`,
    startTime: new Date(),
    sport: sport._id,
    createdBy: admin._id,
    teams: createdTeams.map((t) => t._id),
    credentials: {
      admin: { id: `${auctionName.toLowerCase()}Admin`, secret: "adminSecret" },
      teams: createdTeams.map((t, idx) => ({
        team: t._id,
        teamId: `${t.short}${String(idx + 1).padStart(2, "0")}`,
        secret: `secret${idx + 1}`,
      })),
    },
  });

  await Team.updateMany(
    { _id: { $in: createdTeams.map((t) => t._id) } },
    { $set: { auction: auction._id } }
  );

  // 📦 Auction Sets
  const setCount = Math.ceil(playerCount / 4);
  const setsData = Array.from({ length: setCount }).map((_, idx) => ({
    name: `${auctionName} Set ${String.fromCharCode(65 + idx)}`,
    sport: sport._id,
    auction: auction._id,
    order: idx + 1,
  }));
  const sets = await AuctionSet.insertMany(setsData);
  auction.sets = sets.map((s) => s._id);
  await auction.save();

  // 🧑‍🎓 Players
  const players = [];
  for (let i = 1; i <= playerCount; i++) {
    const setIndex = Math.floor((i - 1) / 4);
    players.push({
      name: `${auctionName} Player ${i}`,
      sport: sport._id,
      auction: auction._id,
      basePrice: 50 + Math.floor(Math.random() * 50),
      auctionSet: sets[setIndex % sets.length]._id,
      attributes: [
        {
          name: "odRating",
          displayName: "ODI Rating",
          type: "number",
          min: 0,
          max: 100,
          required: true,
          defaultValue: Math.floor(Math.random() * 41) + 60,
          order: 1,
        },
        {
          name: "t20Rating",
          displayName: "T20 Rating",
          type: "number",
          min: 0,
          max: 100,
          required: true,
          defaultValue: Math.floor(Math.random() * 41) + 60,
          order: 2,
        },
      ],
    });
  }
  const createdPlayers = await Player.insertMany(players);

  // Link players to sets
  for (let i = 0; i < sets.length; i++) {
    sets[i].players = createdPlayers
      .filter((_, idx) => Math.floor(idx / 4) === i)
      .map((p) => p._id);
    await sets[i].save();
  }

  // 💸 Generate Bids
  const purchasedTeams = new Set();

  for (let i = 0; i < createdPlayers.length; i++) {
    const player = createdPlayers[i];
    const bidCount = Math.floor(Math.random() * 3) + 4; // 4–6 bids
    let amount = player.basePrice;
    const bids = [];
    const baseTime = new Date();
    baseTime.setMinutes(baseTime.getMinutes() - bidCount * 2);

    for (let b = 0; b < bidCount; b++) {
      amount += 10 + Math.floor(Math.random() * 20);
      const biddingTeam = createdTeams[b % createdTeams.length];
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

    // Decide outcome
    if (purchasedTeams.size < createdTeams.length) {
      const team = createdTeams.find((t) => !purchasedTeams.has(String(t._id)));
      if (team) {
        await Bid.findByIdAndUpdate(lastBid._id, {
          status: "won",
          isWinning: true,
        });
        await player.markAsSold(team._id, lastBid.amount);
        team.players = [player._id];
        team.budget -= lastBid.amount;
        await team.save();
        purchasedTeams.add(String(team._id));
      }
    } else if (i === createdPlayers.length - 1) {
      // Last player → ongoing bid
      await Bid.findByIdAndUpdate(lastBid._id, {
        status: "winning",
        isWinning: true,
      });
      await player.updateCurrentBid(lastBid.team, lastBid.amount);
    } else {
      // Unsold player (no winning)
      await Bid.findByIdAndUpdate(lastBid._id, {
        status: "outbid",
        isWinning: false,
      });
    }
  }

  console.log(
    `✅ Created ${auctionName} with ${teamCount} teams and ${playerCount} players`
  );
};

const seedMultipleAuctions = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to DB (multi-auction seed)");

    // Find or create admin
    let admin = await User.findOne({ email: "admin@test.com" });
    if (!admin) {
      admin = await User.create({
        username: "admin1",
        email: "admin@test.com",
        password: "password123",
        role: "admin",
      });
    }

    // Find or create sport
    let cricket = await Sport.findOne({ name: "Cricket" });
    if (!cricket) {
      cricket = await Sport.create({
        name: "Cricket",
        description: "Cricket sport",
      });
    }

    // 🏆 Create 3 auctions
    await createAuctionData({
      auctionName: "Super Cricket Auction 2025",
      teamCount: 4,
      playerCount: 11,
      admin,
      sport: cricket,
    });

    await createAuctionData({
      auctionName: "Mega Cricket Auction 2025",
      teamCount: 6,
      playerCount: 12,
      admin,
      sport: cricket,
    });

    await createAuctionData({
      auctionName: "Ultimate Cricket Auction 2025",
      teamCount: 8,
      playerCount: 14,
      admin,
      sport: cricket,
    });

    console.log("🎉 All 3 auctions seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedMultipleAuctions();
