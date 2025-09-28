import React from "react";
import Hero from "../../components/auction/Hero";
import TourneyCard from "../../components/auction/TourneyCard";
const Home = () => {
  return (
    <div className="flex flex-col items-center space-y-7 text-center  ">
      <Hero />
      {/* Other sections will follow the same color scheme */}
    <TourneyCard />

    </div>
  );
};

export default Home;
