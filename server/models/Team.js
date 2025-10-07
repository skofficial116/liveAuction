import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      default: null,
    },
    captain: {
      name: String,
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    secret: {
      type: String,
      required: true,
    },

    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
    maxPlayers: {
      type: Number,
      default: 25,
    },
    minPlayers: {
      type: Number,
      default: 11,
    },
    basePriceForPlayers: {
      type: Number,
      default: 10,
    },
    budget: {
      type: Number,
      default: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
teamSchema.index({ name: 1 }, { unique: true });
teamSchema.index({ budget: -1 }); //const richTeams = await Team.find().sort({ budget: -1 });

// VIRTUALS
teamSchema.virtual("maxBid").get(function () {
  const minPlayers = this.minPlayers || 0;
  const maxPlayers = this.maxPlayers || 11;

  const currentCount = this.players.length;

  // If team reached max players, no bid possible
  if (currentCount >= maxPlayers) return 0;

  // Players remaining to reach min quota
  const remainingQuota = Math.max(minPlayers - currentCount - 1, 0);

  // Calculate max bid
  // Ensure at least base price is left for remaining quota
  // For now, assume the next player base price is 0 if not known; can be passed dynamically when needed

  const maxBid = this.budget - remainingQuota * this.basePriceForPlayers;

  return maxBid > 0 ? maxBid : 0;
});

teamSchema.virtual("spentBudget").get(function () {
  if (!this.players || this.players.length === 0) return 0;
  return this.players.reduce((total, player) => {
    return total + (player.sold?.price || 0);
  }, 0);
});
// await team.populate("players");
// console.log(`Spent: $${team.spentBudget}`);

teamSchema.virtual("isFull").get(function () {
  const MAX_PLAYERS = 11;
  return this.playerCount >= MAX_PLAYERS;
});
// if (team.isFull) console.log("Team is full, cannot buy more players");

// METHODS
teamSchema.methods.buyPlayer = async function (player, bidAmount) {
  const currentCount = this.players.length;

  if (currentCount >= this.maxPlayers) {
    throw new Error(
      `Cannot buy player. Team already reached max players (${this.maxPlayers})`
    );
  }

  const remainingQuota = Math.max(this.minPlayers - currentCount - 1, 0);
  const maxBid = this.budget - remainingQuota * player.basePrice;

  if (bidAmount > maxBid) {
    throw new Error(`Bid exceeds max allowed. Max bid: $${maxBid}`);
  }

  this.budget -= bidAmount;
  this.players.push(player._id);
  await this.save();

  return this;
};

// await team.buyPlayer(player, 500);
// console.log(team.remainingBudget);

export default mongoose.model("Team", teamSchema);
