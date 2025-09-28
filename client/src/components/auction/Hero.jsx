import React from "react";
import { assets } from "../../assets/assets";
// import SearchBar from "./SearchBar"; 

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full md:pt-10 pt-10 px-7 md:px-0 space-y-7 text-center 
                  ">
      <h1 className="md:text-home-heading-large text-home-heading-small relative font-bold text-[#00224D] max-w-3xl mx-auto">
        Join the Ultimate <span className="text-[#FF204E]">Sports Auction</span>
        <img
          src={assets.sketch}
          alt="sketch"
          className="md:block hidden absolute -bottom-7 right-0"
        />
      </h1>

      <p className="md:block hidden text-[#00224D] max-w-2xl mx-auto">
        Participate in live auctions, bid for your favorite players, and manage your team in real-time. Experience the thrill of the auction with a community of sports enthusiasts.
      </p>

      <p className="md:hidden text-[#00224D] max-w-sm mx-auto">
        Join live auctions and manage your team in real-time with sports fans everywhere.
      </p>

      {/* <SearchBar placeholder="Enter Tournament Name or Nickname" /> */}
    </div>
  );
};

export default Hero;
