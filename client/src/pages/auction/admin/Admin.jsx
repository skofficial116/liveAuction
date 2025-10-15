import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../../components/auction/admin/AdminSidebar.jsx";
const Admin = () => {
  const [joinedAuction, setJoinedAuction] = useState(false);
    const getCookie = (name) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    if (!match) return null;
    const value = decodeURIComponent(match[2]);
    try {
      return JSON.parse(value); // works for objects like auctionUser
    } catch {
      return value; // works for plain strings like auctionId
    }
  };
   useEffect(() => {
  const interval = setInterval(() => {
    const auctionId = getCookie("auctionId");
    const auctionUser = getCookie("auctionUser");

    if (auctionId && auctionUser?.role === "captain") {
      setJoinedAuction(true);
    } else {
      setJoinedAuction(false);
    }
  }, 1000); // check every 1 second

  return () => clearInterval(interval);
}, []);

  
    return !joinedAuction ? (
     <h1 className="text-white text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold bg-gradient-to-r from-gray-800 to-gray-900 min-h-screen flex items-center justify-center">
      Join and Authorize as Admin/Auctioneer for any Auction to access this page 
    </h1>
    ) : (
    <div className="text-default min-h-screen bg-white">
      {/* <Navbar></Navbar> */}
      <div className="flex">
        <Sidebar></Sidebar>
        <div className="flex-1"> {<Outlet></Outlet>}</div>
      </div>
    </div>
  )
};

export default Admin;
