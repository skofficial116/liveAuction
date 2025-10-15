import React from "react";
import { NavLink } from "react-router-dom";
import { Gavel, ScrollText, Shield, User } from "lucide-react";

function Sidebar() {
  const menuItems = [
    {
      name: "Current Bid",
      path: "/auction/captain/currentBid",
      icon: (
        <>
          <Gavel size={22} strokeWidth={1.5} />
        </>
      ),
    },
    {
      name: "Auction History",
      path: "/auction/captain/auctionHistory",
      icon: (
        <>
          <ScrollText size={22} strokeWidth={1.5} />
        </>
      ),
    },
    {
      name: "All Teams",
      path: "/auction/captain/allTeams",
      icon: (
        <>
          <Shield size={22} strokeWidth={1.5} />
        </>
      ),
    },
    {
      name: "My Team",
      path: "/auction/captain/myTeam",
      icon: (
        <>
          <User size={22} strokeWidth={1.5} />
        </>
      ),
    },
  ];

  return (
    <div className="md:w-50 w-15 border-r min-h-screen text-gray-800 border-gray-200 flex flex-col">
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
