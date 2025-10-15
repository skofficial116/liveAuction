import React, { useEffect, useState } from "react";
import Hero from "../../components/auction/Hero";
import TourneyCard from "../../components/auction/TourneyCard";
import AudienceNavbar from "../../components/auction/audience/AudienceNavbar";

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/auctionMeta");
        const json = await response.json();
        setData(json.allAuctions || []); // fallback to empty array
      } catch (error) {
        console.error("Error fetching auction data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F5F7FA] to-[#E0EAFC]">
      {/* <AudienceNavbar /> */}
      <main className="flex flex-col items-center space-y-4 md:space-y-10 text-center px-4 md:px-0 mt-10">
        <Hero />

        {loading && <p className="text-gray-500 text-lg">Loading auctions...</p>}

        {!loading && data.length === 0 && (
          <p className="text-gray-500 text-lg">No auctions available.</p>
        )}

        {!loading &&
          data.length > 0 &&
          data.map((auction, idx) => (
            <TourneyCard data={auction} key={idx} />
          ))}
      </main>

      <footer className="mt-auto py-6 text-center text-sm text-gray-600 border-t border-gray-300">
        © {new Date().getFullYear()} BIDR Sports Auction. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
