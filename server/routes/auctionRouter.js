import express from "express";
import {
  getAllPlayers,
  getAllTeams,
  getMyTeam,getAuctionProfile,getAllAuctionsMeta,getAuctionData, getAllAuctions,placeBid,getAllAuctionsAdmin,createAuction
} from "../controllers/auctionController.js";

const auctionRouter = express.Router();

auctionRouter.get("/teams", getAllTeams);
auctionRouter.get("/players", getAllPlayers);
auctionRouter.get("/myTeam", getMyTeam);
auctionRouter.get("/auction/:id", getAuctionProfile);
auctionRouter.get("/admin/auctionsMeta",getAllAuctionsMeta)
auctionRouter.get("/admin",getAllAuctionsAdmin)
auctionRouter.get("/admin/:id",getAuctionData)
auctionRouter.post("/placeBid",placeBid)
auctionRouter.post("/admin/createAuction",createAuction)
// auctionRouter.get("/")

// auctionRouter.post("/updateCourseProgress", updateUserCourseProgress);

export default auctionRouter;
