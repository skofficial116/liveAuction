import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    { name: "Current Bid", path: "/audience/currentBid" },
    { name: "Auction History", path: "/audience/auctionHistory" },
    { name: "All Teams", path: "/audience/allTeams" },
  ];

  return (
    <div className="nd:w-64 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col">
      {menuItems.map((item) => (
        <NavLink
          className={({ isActive }) =>
            `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${
              isActive
                ? "bg-indigo-50 border-r-[6px] border-indigo-500/90 "
                : "hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90"
            }`
          }
          to={item.path}
          key={item.name}
          end={item.path === "/audience" ? true : false}
        >
          {/* <img src={item.icon} className='w-6 h-6'></img> */}
          <p className="block text-center">{item.name}</p>
        </NavLink>
      ))}
    </div>
  );
}

export default Sidebar;
