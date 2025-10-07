// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import Team from "./models/Team.js"
import Player from "./models/Player.js";
// MongoDB connection
import connectDB from "./configs/mongodb.js";
connectDB();




const app = express();
app.use(express.json());

import auctionRouter from "./routes/auctionRouter.js";
app.use("/auctionMeta", auctionRouter)

app.use("/", (req,res)=>{
  res.send("API is working")
})

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "*" }, // allow any frontend
// });

// // Socket.IO real-time events
// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("joinAuctionRoom", (auctionId) => {
//     socket.join(auctionId);
//     console.log(`User ${socket.id} joined auction room: ${auctionId}`);
//   });

//   socket.on("placeBid", async (data) => {
//     console.log("Bid placed:", data);

//     // Optionally, save bid to DB using placeBid controller
//     // await placeBid(data);

//     // Broadcast to everyone in room
//     io.to(data.auctionId).emit("bidUpdate", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// Start server
const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
