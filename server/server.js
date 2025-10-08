import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors"; // 👈 ADD THIS LINE
import Team from "./models/Team.js";
import Player from "./models/Player.js";
import connectDB from "./configs/mongodb.js";
import socketHandler from "./sockets/index.js";
connectDB();

const app = express();

// ✅ Enable CORS for your frontend (Vite default port 5173)
app.use(
  cors({
    origin: "http://localhost:5173", // Allow your frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true, // optional, if you need cookies/auth headers
  })
);

app.use(express.json());

import auctionRouter from "./routes/auctionRouter.js";
app.use("/auctionMeta", auctionRouter);

app.use("/", (req, res) => {
  res.send("API is working");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

socketHandler(io);


// Start server
const PORT = 4000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
