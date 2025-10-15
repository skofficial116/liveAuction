import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Clock, Play, Eye, DollarSign, Info } from "lucide-react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

// ===================== Auction Entry Modal =====================
export const AuctionEntryModal = ({ auctionData, onClose }) => {
  const { getCookie, setCookie } = useContext(AppContext);
  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("");
  const [teamId, setTeamId] = useState(""); // captain only
  const [secretKey, setSecretKey] = useState("");
  const [error, setError] = useState("");
  const [joinedAuction, setJoinedAuction] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setJoinedAuction(!!getCookie("auctionId"));
    }, 1000);
    return () => clearInterval(interval);
  }, [getCookie]);

  const handleError = (msg) =>
    toast.error(msg, { position: "top-right", autoClose: 3000, closeOnClick: true });

  const handleSubmit = () => {
    setError("");
    if (joinedAuction) return handleError("Already joined an auction.");
    if (!role) return setError("Please select a role");
    if (!userName) return setError("Please enter your name");

    if (role === "audience") {
      setCookie("auctionUser", { role, userName, teamId: null });
      setCookie("auctionId", auctionData._id);
      onClose();
      window.location.href = `/auction/${role}`;
    } else if (role === "admin") {
      if (auctionData?.credentials?.admin?.secret === secretKey) {
        setCookie("auctionUser", { role, userName, teamId: null });
        setCookie("auctionId", auctionData._id);
        onClose();
        window.location.href = `/auction/${role}`;
      } else setError("Invalid Admin Secret Key");
    } else if (role === "captain") {
      if (!teamId) return setError("Please select a team");
      const teamCred = auctionData?.credentials?.teams?.find((t) => t.teamId === teamId);
      if (teamCred && secretKey === teamCred.secret) {
        setCookie("auctionUser", { role, userName, teamId: teamCred.teamId });
        setCookie("auctionId", auctionData._id);
        onClose();
        window.location.href = `/auction/${role}`;
      } else setError("Invalid Captain Secret Key");
    }
  };

  if (!auctionData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700 rounded-3xl shadow-xl p-8 w-96 space-y-5 text-white">
        <h2 className="text-2xl font-bold text-center">Enter Auction</h2>
        <div className="space-y-3">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Name"
            className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
          >
            <option value="">-- Select Role --</option>
            <option value="audience">Audience</option>
            <option value="captain">Captain</option>
            <option value="admin">Admin</option>
          </select>

          {role === "captain" && auctionData?.teams?.length > 0 && (
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
            >
              <option value="">-- Select Team --</option>
              {auctionData.teams.map((team) => (
                <option key={team._id} value={team._id}>{team.name}</option>
              ))}
            </select>
          )}

          {(role === "captain" || role === "admin") && (
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Secret Key"
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
            />
          )}

          {error && <div className="text-red-400">{error}</div>}

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg"
          >
            Enter Auction
          </button>
        </div>
      </div>
    </div>
  );
};

// ===================== Auction Page =====================
const AuctionPage = () => {
  const { getCookie } = useContext(AppContext);
  const { auctionId } = useParams();
  const [auctionData, setAuctionData] = useState(null);
  const [auctionStatus, setAuctionStatus] = useState("loading");
  const [timeLeft, setTimeLeft] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  // Fetch auction data
  useEffect(() => {
    axios.get(`http://localhost:4000/auctionMeta/auction/${auctionId}`)
      .then(res => res.data.success ? setAuctionData(res.data.auctionData) : setError("Invalid data"))
      .catch(() => setError("Unable to fetch auction details"));
  }, [auctionId]);

  // Timer logic
  useEffect(() => {
    if (!auctionData) return;
    let start = new Date(auctionData.startTime).getTime();
    const now = Date.now();
    if (isNaN(start) || start < now) start = now + 10000;
    const end = start + 2 * 60 * 60 * 1000;

    const timer = setInterval(() => {
      const current = Date.now();
      if (current < start) {
        setAuctionStatus("not_started");
        const diff = start - current;
        setTimeLeft({ h: Math.floor(diff / 3600000), m: Math.floor(diff / 60000 % 60), s: Math.floor(diff / 1000 % 60) });
      } else if (current < end) {
        setAuctionStatus("live");
        const diff = end - current;
        setTimeLeft({ h: Math.floor(diff / 3600000), m: Math.floor(diff / 60000 % 60), s: Math.floor(diff / 1000 % 60) });
      } else setAuctionStatus("ended");
    }, 1000);

    return () => clearInterval(timer);
  }, [auctionData]);

  // Show modal if live and no user cookie
  useEffect(() => {
    if (!getCookie("auctionUser") && auctionStatus === "live") setShowModal(true);
  }, [auctionStatus, getCookie]);

  if (error) return <div className="h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!auctionData) return <div className="h-screen flex items-center justify-center text-gray-400">Loading auction details...</div>;

  const statusStyles = {
    not_started: { label: "Starts In", gradient: "from-yellow-400 via-orange-500 to-red-500", btnColor: "bg-orange-500 cursor-default", icon: <Clock className="w-5 h-5" /> },
    live: { label: "LIVE NOW", gradient: "from-green-400 via-emerald-500 to-teal-600", btnColor: "bg-green-600 cursor-pointer animate-pulse", icon: <Play className="w-5 h-5" /> },
    ended: { label: "Auction Ended", gradient: "from-gray-400 via-gray-500 to-gray-600", btnColor: "bg-gray-500 cursor-not-allowed", icon: <Eye className="w-5 h-5" /> },
  };
  const currentStatus = statusStyles[auctionStatus] || statusStyles.not_started;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#3b82f6_0%,_transparent_60%)] opacity-40"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_#9333ea_0%,_transparent_70%)] opacity-30"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-pink-500 to-purple-500">{auctionData.name}</h1>
        <p className="text-gray-300 max-w-2xl">{auctionData.description}</p>

        {/* Status Card */}
        <div className={`bg-gradient-to-r ${currentStatus.gradient} shadow-lg rounded-3xl p-[1px] my-8`}>
          <div className="bg-[#0f172a]/90 rounded-3xl py-6 px-6 text-center">
            <div className="flex justify-center items-center gap-2 mb-3">{currentStatus.icon}<h2 className="text-2xl font-bold">{currentStatus.label}</h2></div>
            {auctionStatus !== "ended" ? (
              <div className="flex justify-center gap-6 text-xl font-semibold">
                <div className="bg-white/10 px-5 py-3 rounded-xl">{timeLeft.h ?? 0}h</div>
                <div className="bg-white/10 px-5 py-3 rounded-xl">{timeLeft.m ?? 0}m</div>
                <div className="bg-white/10 px-5 py-3 rounded-xl">{timeLeft.s ?? 0}s</div>
              </div>
            ) : <p className="text-gray-300 text-lg">The auction has concluded.</p>}
          </div>
        </div>

        {/* Teams Grid */}
        <h2 className="text-3xl font-semibold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-500">Participating Teams</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {auctionData.teams?.map(team => (
            <div key={team._id} className="group relative bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md overflow-hidden hover:scale-[1.02] transition-all duration-300">
              <div className="absolute inset-0" style={{ backgroundColor: team.color, opacity: 0.3 }}></div>
              <div className="relative p-6 flex flex-col items-center space-y-3">
                <div className="w-20 h-20 flex items-center justify-center text-3xl font-bold text-white rounded-full shadow-lg" style={{ backgroundColor: team.color }}>{team.short}</div>
                <h3 className="text-lg font-semibold text-white">{team.name}</h3>
                <p className="text-sm italic text-gray-400">“{team.slogan}”</p>
                <div className="flex items-center gap-1 text-sm text-gray-300"><DollarSign className="w-4 h-4 text-emerald-400" />{team.budget?.toLocaleString()} Credits</div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="mt-16 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-lg p-8 text-gray-300">
          <div className="flex items-center gap-2 mb-6 text-white font-semibold text-lg"><Info className="text-blue-400" /> Auction Summary</div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
            <div><span className="block text-gray-400">Total Teams</span><span className="font-medium text-white">{auctionData.teams?.length ?? 0}</span></div>
            <div><span className="block text-gray-400">Total Sets</span><span className="font-medium text-white">{auctionData.sets?.length ?? 0}</span></div>
            <div><span className="block text-gray-400">Initial Budget</span><span className="font-medium text-white">{auctionData.settings?.initialBudget ?? "--"}</span></div>
            <div><span className="block text-gray-400">Min Bid Increment</span><span className="font-medium text-white">{auctionData.settings?.minBidIncrement ?? "--"}</span></div>
            <div><span className="block text-gray-400">Bid Time Limit</span><span className="font-medium text-white">{auctionData.settings?.bidTimeLimit ?? "--"}s</span></div>
            <div><span className="block text-gray-400">Max Extensions</span><span className="font-medium text-white">{auctionData.settings?.maxTimeExtensions ?? "--"}</span></div>
          </div>
        </div>
      </div>

      {/* Sticky Auction Button */}
      <button
        onClick={() => {
          const user = getCookie("auctionUser");
          if (auctionStatus === "live") user ? window.location.href = `/auction/${user.role}` : setShowModal(true);
        }}
        className={`fixed bottom-6 right-6 ${currentStatus.btnColor} text-white px-6 py-3 rounded-full flex items-center gap-2 z-50`}
        disabled={auctionStatus !== "live"}
      >
        {currentStatus.icon} <span>{currentStatus.label}</span>
      </button>

      {/* Modal */}
      {showModal && <AuctionEntryModal auctionData={auctionData} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default AuctionPage;
