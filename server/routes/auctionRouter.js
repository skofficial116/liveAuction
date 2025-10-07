import express from "express";
import {
  getAllPlayers,
  getAllTeams,
  getMyTeam,
} from "../controllers/auctionController.js";

const auctionRouter = express.Router();

auctionRouter.get("/teams", getAllTeams);
auctionRouter.get("/players", getAllPlayers);
auctionRouter.get("/myTeam", getMyTeam);
// auctionRouter.get("/")

// auctionRouter.post("/updateCourseProgress", updateUserCourseProgress);

export default auctionRouter;
