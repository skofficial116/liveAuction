import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";

// Student Imports
import Home from "./pages/student/Home.jsx";
import Navbar from "./components/student/Navbar.jsx";
import TeamsPage from "./pages/auction/audience/TeamsPage.jsx";
import AuctionPage from "./pages/auction/AuctionDetails.jsx";
import AuctionHistory from "./pages/auction/audience/AuctionHistory.jsx";
import CurrentBid from "./pages/auction/audience/CurrentBid.jsx";
import Audience from "./pages/auction/audience/Audience.jsx";
import CaptainCurrentBid from "./pages/auction/captain/CurrentBid.jsx";
import Captain from "./pages/auction/captain/Captain.jsx";
import MyTeamPage from "./pages/auction/captain/MyTeamPage.jsx";
import Admin from "./pages/auction/admin/Admin.jsx";
import AdminCurrentBid from "./pages/auction/admin/CurrentBid.jsx";
import AdminTeamsPage from "./pages/auction/admin/TeamPage.jsx";
import ManageSetsPage from "./pages/auction/admin/ManageSets.jsx";
import ManagePlayersPage from "./pages/auction/admin/ManagePlayersPage.jsx";
import AdminSettings from "./pages/auction/admin/Settings.jsx";
import AudienceNavbar from "./components/auction/audience/AudienceNavbar.jsx";
import Dashboard from "./pages/auction/admin/Dashboard.jsx";

const App = () => {
  const location = useLocation();

  // Paths where you DON'T want the AudienceNavbar to show
  const hideNavbarPaths = ["/dashboard"];

  const shouldShowAudienceNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="text-default min-h-screen bg-gradient-to-b from-[#3C467B] via-[#50589C] to-[#636CCB]">
      <ToastContainer />

      {shouldShowAudienceNavbar && <AudienceNavbar />}

      <Routes>
        {/* Student Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auction/:auctionId" element={<AuctionPage />} />

        <Route path="/auction/audience" element={<Audience />}>
          <Route index element={<CurrentBid />} />
          <Route path="currentBid" element={<CurrentBid />} />
          <Route path="auctionHistory" element={<AuctionHistory />} />
          <Route path="allTeams" element={<TeamsPage />} />
        </Route>
        <Route path="/auction/captain" element={<Captain />}>
          <Route index element={<CaptainCurrentBid />} />
          <Route path="currentBid" element={<CaptainCurrentBid />} />
          <Route path="auctionHistory" element={<AuctionHistory />} />
          <Route path="allTeams" element={<TeamsPage />} />
          <Route path="myTeam" element={<MyTeamPage />} />
        </Route>
        <Route path="/auction/admin" element={<Admin />}>
          <Route index element={<AdminCurrentBid />} />
          <Route path="currentBid" element={<AdminCurrentBid />} />
          <Route path="auctionHistory" element={<AuctionHistory />} />
          <Route path="allTeams" element={<AdminTeamsPage />} />
          <Route path="manageSets" element={<ManageSetsPage />} />
          <Route path="managePlayers" element={<ManagePlayersPage />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;

// import "./App.css";
// import { useState, useEffect } from "react";

// import io from "socket.io-client";
// import { nanoid } from "nanoid";

// const socket = io.connect("http://localhost:3100");
// const username = nanoid(4);
// console.log("Username: ", username);

// function App() {
//   const [message, setMessage] = useState("");
//   const [chat, setChat] = useState([]);

//   const sendChat = (e) => {
//     e.preventDefault();
//     socket.emit("chat", { message, username });
//     setMessage("");
//   };

//   useEffect(() => {
//     socket.on("chat", (payload) => {
//       setChat((prevChat) => [...prevChat, payload]);
//       console.log("Message from server: ", payload);
//     });

//     socket.on("chatHistory", (messages) => {
//       setChat(messages);
//       console.log("Chat history: ", messages);
//     });

//     // Cleanup listeners on unmount
//     return () => {
//       socket.off("chat");
//       socket.off("chatHistory");
//     };
//   }, []);
//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Socket.io Chat App</h1>
//         {chat.map((payload, index) => {
//           return (
//             <p key={index}>
//               {payload.message}: {payload.username}
//             </p>
//           );
//         })}
//         <form onSubmit={sendChat}>
//           <input
//             type="text"
//             name="message"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />

//           <button type="submit"> Send </button>
//         </form>
//       </header>
//     </div>
//   );
// }

// export default App;
