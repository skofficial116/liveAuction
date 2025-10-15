import mongoose, { mongo } from "mongoose";

const playerAttributeSchema = new mongoose.Schema({
  attributeId: { type: mongoose.Schema.Types.ObjectId, ref: "Attribute", required: true }, // reference to original Attribute
  name: { type: String, required: true },
  description: { type: String },
  typeOf: { type: String, enum: ["string", "int", "select"], default: "string" },
  options: [{ type: String, default: null }],
  defaultValue: mongoose.Schema.Types.Mixed, // original default
  value: mongoose.Schema.Types.Mixed, // player-specific value
});


const playerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sport: { type: mongoose.Schema.Types.ObjectId, ref: "Sport", required: true },
  auction: { type: mongoose.Schema.Types.ObjectId, ref: "Auction", required: true },
  basePrice: { type: Number, required: true, min: 10 },

  attributes: [playerAttributeSchema], 

  sold: {
    isSold: { type: Boolean, default: false },
    price: {type:Number, default:null},
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", default:null },
    soldAt: {type:Date, default:null},
  },

  auctionSet: { type: mongoose.Schema.Types.ObjectId, ref: "AuctionSet" },
}, { timestamps: true });


// Indexes
playerSchema.index({ name: 1, sport: 1 }, { unique: true });
playerSchema.index({ "sold.isSold": 1 });
playerSchema.index({ "currentBid.amount": -1 });

// Virtuals
playerSchema.virtual("currentBidAmount").get(function () {
  return this.currentBid?.amount || 0;
});
playerSchema.virtual("currentBidTeam").get(function () {
  return this.currentBid?.team || null;
});

playerSchema.virtual("attributeSummary").get(function () {
  return this.attributes
    .map((attr) => `${attr.displayName}: ${attr.defaultValue || "-"}`)
    .join(", ");
});

// METHODS
playerSchema.methods.markAsSold = async function (teamId, price) {
  this.sold.isSold = true;
  this.sold.team = teamId;
  this.sold.price = price;
  this.sold.soldAt = new Date();
  await this.save();
  return this;
};

playerSchema.methods.updateCurrentBid = async function (teamId, amount) {
  this.currentBid = {
    team: teamId,
    amount,
    timestamp: new Date(),
  };
  await this.save();
  return this;
};

playerSchema.methods.resetAuction = async function () {
  this.sold = { isSold: false };
  this.currentBid = { amount: 0 };
  await this.save();
  return this;
};

// Quickly fetch all players in a specific auction set.
playerSchema.index({ auctionSet: 1 });
// const setPlayers = await Player.find({ auctionSet: setId });

export default mongoose.model("Player", playerSchema);
