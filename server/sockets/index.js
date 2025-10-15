// socket/index.js
import auctionSocket from "./routes/auctionSocket.js";
// import chatSocket from "./routes/chatSocket.js";
import cookie from "cookie";

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id);

    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    const auctionUser = cookies.auctionUser ? JSON.parse(cookies.auctionUser) : null;

    console.log("Auction user:", auctionUser);

    // Register different socket routes
    auctionSocket(io, socket);
    // chatSocket(io, socket);

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });
}
