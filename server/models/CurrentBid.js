import mongoose from "mongoose";

const currentBidSchema = new mongoose.Schema(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

currentBidSchema.methods.updateBid = async function (newData) {
  try {
    if (!newData.team) {
      throw new Error("Team ID not found");
    }
    if (!newData.amount) {
      throw new Error("Amount not found");
    }
    if (!newData.player) {
      throw new Error("Player ID not found");
    }

    if (this.amount >= newData.amount && this.player === newData.player) {
      throw new Error("Bid amount should be greater than the current amount");
    }
    this.team = newData.team;
    this.player = newData.player;
    this.amount = newData.amount;

    await this.save();
    return this;
  } catch (error) {
    throw new Error("Error updating bid: " + error.message);
  }
};

export default mongoose.model("CurrentBid", currentBidSchema);
