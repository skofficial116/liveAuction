import React from "react";
import { NavLink } from "react-router-dom";
import {
  Gavel,
  ScrollText,
  Shield,
  LayoutGrid,
  UserCog,
  Cog,
} from "lucide-react";

function Sidebar() {
  const menuItems = [
    {
      name: "Current Bid",
      path: "/auction/admin/currentBid",
      icon: (
        <>
          <Gavel size={22} strokeWidth={1.5} />
        </>
      ),
    },
    {
      name: "Auction History",
      path: "/auction/admin/auctionHistory",
      icon: (
        <>
          <ScrollText size={22} strokeWidth={1.5} />
        </>
      ),
    },
    {
      name: "All Teams",
      path: "/auction/admin/allTeams",
      icon: (
        <>
          <Shield size={22} strokeWidth={1.5} />
        </>
      ),
    },
    {
      name: "Manage Sets",
      path: "/auction/admin/manageSets",
      icon: (
        <>
          <LayoutGrid size={22} strokeWidth={1.5} />
        </>
      ),
    },
    {
      name: "Manage Players",
      path: "/auction/admin/managePlayers",
      icon: (
        <>
          <UserCog size={22} strokeWidth={1.5} />
        </>
      ),
    },
    {
      name: "Settings",
      path: "/auction/admin/settings",
      icon: (
        <>
          <Cog size={22} strokeWidth={1.5} />
        </>
      ),
    },
  ];

  return (
    <div className="md:w-64 w-20 border-r min-h-screen text-gray-800 border-gray-200 flex flex-col">
      {/* You can add a logo or header here if you like */}
      <div className="flex-grow pt-4">
        {menuItems.map((item) => (
          <NavLink
            className={({ isActive }) =>
              `flex items-center md:flex-row flex-col justify-center md:justify-start md:py-3 py-4 md:px-6 md:gap-4 gap-1.5 transition-colors duration-200 ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 border-r-4 border-indigo-500"
                  : "hover:bg-gray-100 border-r-4 border-transparent"
              }`
            }
            to={item.path}
            key={item.name}
          >
            {/* Icon is always visible */}
            {item.icon}
            
            {/* Text is hidden on small screens, visible on medium and up */}
            <p className="hidden md:block text-sm font-medium">{item.name}</p>
          </NavLink>
        ))}
      </div>
       {/* You can add a footer/logout button here */}
    </div>
  );
}

export default Sidebar;