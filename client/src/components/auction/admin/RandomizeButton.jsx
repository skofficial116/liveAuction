import React from "react";

const RandomizeButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  >
    Randomize Order
  </button>
);

export default RandomizeButton;
