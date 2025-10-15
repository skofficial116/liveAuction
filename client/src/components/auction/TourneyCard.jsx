import React from "react";
import { Users } from "lucide-react"; // Lucide icon for teams

const TourneyCard = ({ data }) => {
  if (!data) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        <p className="text-red-500 text-lg">Failed to load auction data.</p>
      </div>
    );
  }

  const { name, description, startTime, teams } = data;
  const teamCount = teams?.length || 0;

  return (
    <section className="w-full flex justify-center px-4 py-4">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
        <div className="bg-gradient-to-r from-[#FF204E] to-[#A0153E] px-6 py-4 flex justify-between items-center">
          <h5 className="font-semibold text-white tracking-wide uppercase">
            Upcoming Auction
          </h5>
          <span className="flex items-center text-white font-medium">
            <Users className="w-5 h-5 mr-1" /> {teamCount} Teams
          </span>
        </div>

        <div className="p-6 md:p-8 text-left md:text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-[#00224D]">
            {name}
          </h2>
          <p className="mb-4 text-gray-600 text-base md:text-lg">{description}</p>
          <p className="mb-6 text-gray-500 text-sm md:text-base">
            Starts at:{" "}
            {new Date(startTime).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          <a
            href={`/auction/${data._id}`}
            className="inline-block bg-gradient-to-r from-[#FF204E] to-[#A0153E] text-white font-semibold py-3 px-8 rounded-full hover:opacity-90 transition-opacity duration-200 text-lg"
          >
            Join the Auction
          </a>
        </div>
      </div>
    </section>
  );
};

export default TourneyCard;
