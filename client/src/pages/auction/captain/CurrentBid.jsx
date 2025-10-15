import { Gavel } from "lucide-react";
import TopBidsSection from "../../../components/auction/TopBids";
import BidHistorySection from "../../../components/auction/BidHistory";
import CurrentBidDetails from "../../../components/auction/CurrentbidDetails";
import { AppContext } from "../../../context/AppContext";
import { useContext } from "react";

const CurrentBid = () => {
  const {  currentBidPlayer,timerEnd,remainingBudget,placeBid,bidHistory,topBids} = useContext(AppContext);
  
  

  const handleSeeMore = () => {
    alert("In a real application, this would navigate to /players page");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            IPL Auction 2025
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Current Bidding Session
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <CurrentBidDetails
              playerData={currentBidPlayer}
              timerEnd={timerEnd}
              remainingBudget={remainingBudget}
              placeBid={placeBid}
            />
          </div>
          <div className=" sm:mt-6 mb-5">
            <BidHistorySection history={bidHistory} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <TopBidsSection topBids={topBids} onSeeMore={handleSeeMore} />
        </div>
      </div>
    </div>
  );
};

export default CurrentBid;
