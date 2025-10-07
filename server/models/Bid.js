import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  auction: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Auction', 
    required: true 
  },
  player: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Player', 
    required: true 
  },
  team: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'outbid', 'won', 'winning'], 
    default: 'pending' 
  },
  isWinning: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

// Indexes
bidSchema.index({ auction: 1, player: 1, amount: -1 });
// const topBid = await Bid.find({ auction: auctionId, player: playerId })
//   .sort({ amount: -1 })
//   .limit(1);

bidSchema.index({ team: 1, status: 1 });
// const activeBids = await Bid.find({ team: teamId, status: "pending" });

bidSchema.index({ player: 1, isWinning: 1 });
// const winningBid = await Bid.findOne({ player: playerId, isWinning: true });



// METHODS
bidSchema.methods.acceptBid = async function () {
  this.status = "accepted";
  this.isWinning = true;
  await this.save();
  return this;
};

// await bid.acceptBid();
// console.log(bid.status); // accepted
// console.log(bid.isWinning); // true
bidSchema.methods.outbid = async function () {
  this.status = "outbid";
  this.isWinning = false;
  await this.save();
  return this;
};

// await bid.outbid();
// console.log(bid.status); // outbid
// console.log(bid.isWinning); // false

bidSchema.methods.markAsWon = async function () {
  this.status = "won";
  this.isWinning = true;
  await this.save();
  return this;
};
// await bid.markAsWon();
// console.log(bid.status); // won
// console.log(bid.isWinning); // true



export default mongoose.model('Bid', bidSchema);