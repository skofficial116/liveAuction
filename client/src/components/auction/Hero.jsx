import React from "react";
import { assets } from "../../assets/assets";

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center w-full space-y-8 text-center">
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-[#00224D] relative max-w-4xl">
        Join the Ultimate{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF204E] to-[#A0153E]">
          Sports Auction
        </span>
        <img
          src={assets.sketch}
          alt="sketch"
          className="hidden md:block absolute -bottom-6 right-0 w-24 opacity-80"
        />
      </h1>

      <p className="text-[#00224D] max-w-2xl mx-auto text-sm sm:text-base md:text-lg opacity-80">
        Participate in live auctions, bid for your favorite players, and manage
        your dream team in real-time. Experience the thrill of the auction with
        a passionate sports community.
      </p>

      {/* <a
        href="#auction"
        className="inline-block bg-gradient-to-r from-[#FF204E] to-[#A0153E] text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
      >
        Explore Auctions
      </a> */}
    </section>
  );
};

export default Hero;
