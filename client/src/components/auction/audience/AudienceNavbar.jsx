import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../../assets/assets";

const AudienceNavbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Function to get cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      try {
        return JSON.parse(parts.pop().split(";").shift());
      } catch {
        return null;
      }
    }
    return null;
  };

  // Load user data on component mount
  useEffect(() => {
    const auctionUser = getCookie("auctionUser");
    if (auctionUser) {
      setUser(auctionUser);
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    document.cookie = "auctionUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUser(null);
    navigate("/"); // redirect to login page
  };

  return (
    <nav className="flex items-center justify-between px-5 md:px-10 py-3 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <img src={assets.logo} className="w-50 md:w-55" alt="BIDR Logo" />
      </Link>

      <div className="flex items-center gap-4 md:gap-6 text-gray-600">
        {user ? (
          <>
            <p className="hidden sm:block font-medium">
              Hello, <span className="text-[#FF204E]">{user.userName}</span>
            </p>
           
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-1 bg-[#FF204E] text-white rounded-md hover:bg-[#e01b42]"
            >
              Log Out
            </button>
          </>
        ) : (
          <p className="hidden sm:block font-medium">
            Welcome to <span className="text-[#FF204E]">BIDR</span>
          </p>
        )}
      </div>
    </nav>
  );
};

export default AudienceNavbar;
