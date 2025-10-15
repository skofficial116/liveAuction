import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      default: null,
    },
    short: { type: String },
    slogan: { type: String },
    color: { type: String },
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
teamSchema.index({ name: 1 });
teamSchema.index({ budget: -1 });

// ---------------------
// VIRTUALS
// ---------------------

// Current number of players (safe even if not populated)
teamSchema.virtual("playerCount").get(function () {
  return Array.isArray(this.players) ? this.players.length : 0;
});

// Max bid the team can place safely
teamSchema.virtual("maxBid").get(function () {
  const minPlayers = this.minPlayers || 0;
  const maxPlayers = this.maxPlayers || 11;
  const currentCount = Array.isArray(this.players) ? this.players.length : 0;

  if (currentCount >= maxPlayers) return 0;

  const remainingQuota = Math.max(minPlayers - currentCount - 1, 0);
  const maxBid = this.budget - remainingQuota * this.basePriceForPlayers;

  return maxBid > 0 ? maxBid : 0;
});

// Total spent budget
teamSchema.virtual("spentBudget").get(function () {
  if (!Array.isArray(this.players) || this.players.length === 0) return 0;

  // If players are populated
  if (typeof this.players[0] === "object" && this.players[0]?.sold) {
    return this.players.reduce((total, player) => {
      return total + (player.sold?.price || 0);
    }, 0);
  }

  // If players are ObjectIds, we cannot calculate spent budget
  return 0;
});

// Check if team is full
teamSchema.virtual("isFull").get(function () {
  return (Array.isArray(this.players) ? this.players.length : 0) >= this.maxPlayers;
});

// ---------------------
// METHODS
// ---------------------

teamSchema.methods.buyPlayer = async function (player, bidAmount) {
  const currentCount = Array.isArray(this.players) ? this.players.length : 0;

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

export default mongoose.model("Team", teamSchema);
