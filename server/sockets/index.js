// socket/index.js
import auctionSocket from "./routes/auctionSocket.js";
// import chatSocket from "./routes/chatSocket.js";

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id);

    // Register different socket routes
    auctionSocket(io, socket);
    // chatSocket(io, socket);

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });
}
