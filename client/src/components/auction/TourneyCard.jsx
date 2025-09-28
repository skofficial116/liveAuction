import React from "react";

const TourneyCard = () => {
  const data = {
    header: "Coming Soon",
    title: "SPL Season-6 Auction",
    text: "Get ready for the most exciting auction of the season! Stay tuned for more details.",
    buttonText: "Join the Auction",
    buttonLink: "auction", 
  };
  const { header, title, text, buttonText, buttonLink = "#" } = data;

  return (
    <div className="max-w-3xl mx-auto my-8">
      <div className="border border-[#5D0E41] rounded-lg bg-[#00224D] text-white shadow-lg">
        <div className="px-6 py-3 border-b border-[#A0153E]">
          <h5 className="font-medium text-[#FF204E]">{header}</h5>
        </div>
        <div className="p-6">
          <h5 className="text-2xl font-bold mb-2 text-[#FF204E]">{title}</h5>
          <p className="mb-4 text-[#A0153E]">{text}</p>
          <a
            href={buttonLink}
            className="inline-block bg-[#FF204E] text-white font-semibold py-2 px-4 rounded hover:bg-[#A0153E] transition-colors duration-200"
          >
            {buttonText}
          </a>
        </div>
      </div>
    </div>
  );
};

export default TourneyCard;
