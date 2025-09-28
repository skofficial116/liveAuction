import { dummyPlayers } from "../../assets/assets";
export const PlayerSoFar = ({ playerId }) => {
    const player = dummyPlayers.find((p) => p.id === playerId);    
  return (
    <div>
      <div
        key={playerId}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between bg-gray-50 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-center space-x-4">
          <div className="font-semibold text-gray-800">{player.name}</div>
         
        </div>
        <div className="flex space-x-4 mt-2 lg:mt-0 text-gray-700 text-sm">
          <span>Bat: {player.batSkill}</span>
          <span>Bowl: {player.bowlSkill}</span>
          <span>Base: ${player.basePrice}</span>
          <span className="text-blue-600 font-semibold">
            Sold: ${player.soldPrice}
          </span>
        </div>
      </div>
    </div>
  );
};
