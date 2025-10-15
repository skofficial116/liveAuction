import mongoose from "mongoose";

const auctionSetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
    status: {
      type: String,
      enum: ["scheduled","draft", "in_progress", "completed"],
      default: "draft",
    },
    // order: {
    //   type: Number,
    //   default: 0,
    // },
    startTime: Date,
    endTime: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
auctionSetSchema.index({ auction: 1, order: 1 });
auctionSetSchema.index({ status: 1 });
auctionSetSchema.index({ currentPlayer: 1 });


// Virtual for completed players
auctionSetSchema.virtual("soldPlayers", {
  ref: "Player",
  localField: "players",
  foreignField: "_id",
  match: { "sold.isSold": true },
});

// Virtual for unsold players
auctionSetSchema.virtual("unsoldPlayers", {
  ref: "Player",
  localField: "players",
  foreignField: "_id",
  match: { "sold.isSold": { $ne: true } },
});

// Virtual for checking if the auction set is active
auctionSetSchema.virtual("isActive").get(function () {
  return this.status === "in_progress";
});

// METHODS
auctionSetSchema.methods.startSet = async function () {
  this.status = "in_progress";
  this.startTime = new Date();
  await this.save();
  return this;
};
auctionSetSchema.methods.endSet = async function () {
  this.status = "completed";
  this.endTime = new Date();
  await this.save();
  return this;
};
// await set.startSet();
// console.log(set.status);

// find next player
auctionSetSchema.methods.nextPlayer = async function () {
  if (!this.players || this.players.length === 0) return null;

  // Initialize a history array if not present
  if (!this._selectedPlayers) {
    this._selectedPlayers = [];
  }

  // Filter unsold and not-yet-selected players
  const remainingPlayerIds = this.players.filter(
    (p) => !this._selectedPlayers.includes(String(p))
  );

  // Fetch only unsold players
  const unsoldPlayers = await this.model("Player").find({
    _id: { $in: remainingPlayerIds },
    "sold.isSold": false,
  });

  if (unsoldPlayers.length === 0) {
    this.currentPlayer = null; // No players left
    await this.save();
    return null;
  }

  // Pick a random player
  const randomPlayer =
    unsoldPlayers[Math.floor(Math.random() * unsoldPlayers.length)];

  // Update currentPlayer and history
  this.currentPlayer = randomPlayer._id;
  this._selectedPlayers.push(String(randomPlayer._id));

  await this.save();
  return this.currentPlayer;
};

// const next = await set.nextPlayer();

export default mongoose.model("AuctionSet", auctionSetSchema);
