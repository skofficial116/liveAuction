import mongoose from "mongoose";

const teamCredentialSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    teamId: {
      type: String,
      required: true,
    },
    secret: {
      type: String,
      required: true,
      select: false,
    },
    token: {
      type: String,
      select: false,
    },
    tokenExpiry: {
      type: Date,
      select: false,
    },
  },
  { _id: false }
);

const auctionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    startTime: {
      type: Date,
      required: true,
    },
    endTime: { type: Date, default: null },
    status: {
      type: String,
      enum: ["scheduled", "in_progress", "paused", "completed"],
      default: "scheduled",
    },
    sport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sport",
      required: true,
    },
    sets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuctionSet",
      },
    ],
    currentSet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuctionSet",
    },
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    credentials: {
      admin: {
        id: {
          type: String,
          required: true,
        },
        secret: {
          type: String,
          required: true,
          select: false,
        },
      },
      teams: [teamCredentialSchema],
    },
    settings: {
      initialBudget: {
        type: Number,
        default: 1000,
      },
      minBidIncrement: {
        type: Number,
        default: 10,
      },
      bidTimeLimit: {
        type: Number,
        default: 30,
      },
      timeExtensionDuration: {
        type: Number,
        default: 30,
      },
      maxTimeExtensions: {
        type: Number,
        default: 3,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
auctionSchema.index({ status: 1 });
auctionSchema.index({ startTime: 1 });
auctionSchema.index({ "credentials.admin.id": 1 });
auctionSchema.index({ "credentials.teams.teamId": 1 });

// Virtual for active teams
auctionSchema.virtual("activeTeams", {
  ref: "Team",
  localField: "teams",
  foreignField: "_id",
  match: { isActive: true },
});

//indexes

auctionSchema.index({ status: 1, startTime: 1 });
// const upcoming = await Auction.find({
//   status: "scheduled",
//   startTime: { $gte: new Date() }
// }).sort({ startTime: 1 });

auctionSchema.index({ createdBy: 1 });
// const userAuctions = await Auction.find({ createdBy: userId });

auctionSchema.index({ name: "text", description: "text" });
// const results = await Auction.find({ $text: { $search: "cricket" } });

// Methods
auctionSchema.methods.startAuction = async function () {
  this.status = "in_progress";
  await this.save();
  return this;
};
auctionSchema.methods.pauseAuction = async function () {
  this.status = "paused";
  await this.save();
  return this;
};
auctionSchema.methods.completeAuction = async function () {
  this.status = "completed";
  await this.save();
  return this;
};

auctionSchema.methods.resumeAuction = async function () {
  if (this.status === "paused") {
    this.status = "in_progress";
    await this.save();
  }
  return this;
};

export default mongoose.model("Auction", auctionSchema);
