import React from "react";
import PlayerCard from "./PlayerCard";

const PlayerList = ({ players, sets, addPendingChange }) => {
  const handleRemovePlayer = (player) => {
    addPendingChange({
      type: "remove",
      player,
      fromSet: player.set,
    });
  };

  const handleMovePlayer = (player, toSet) => {
    addPendingChange({
      type: "move",
      player,
      fromSet: player.set,
      toSet,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          sets={sets}
          onRemove={() => handleRemovePlayer(player)}
          onMove={(toSet) => handleMovePlayer(player, toSet)}
        />
      ))}
    </div>
  );
};

export default PlayerList;
