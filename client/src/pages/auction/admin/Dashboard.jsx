import React, { useState, useEffect } from "react";
import Navbar from "../../../components/adminDashboard/Navbar";
import HomePage from "../../../components/adminDashboard/HomePage";
import DashboardPage from "../../../components/adminDashboard/DashboardPage";
import CreateAuction from "../../../components/adminDashboard/CreateAuction";

// Your transformApiToAuctions function stays the same

const transformApiToAuctions = (apiData) => {
  if (!apiData?.success || !Array.isArray(apiData.allAuctions)) return [];

  return apiData.allAuctions.map((auction) => {
    // Map teams
    const teams = (auction.teams || []).map((team) => ({
      id: team._id,
      name: team.name,
      short: team.short,
      budget: team.budget,
      color: team.color,
      slogan: team.slogan,
      players: [], // will fill players later
    }));

    // Map attributes (gather all unique attributes from all players)
    const attributeMap = {};
    auction.sets?.forEach((set) => {
      set.players?.forEach((player) => {
        player.attributes?.forEach((attr) => {
          if (!attributeMap[attr.name]) {
            attributeMap[attr.name] = {
              id: Object.keys(attributeMap).length + 1,
              name: attr.displayName || attr.name,
              isPrimary: false, // you can add custom logic to mark primary
              defaultValue: attr.defaultValue,
              type: attr.type,
            };
          }
        });
      });
    });
    const attributes = Object.values(attributeMap);

    // Map players
    const players = [];
    auction.sets?.forEach((set) => {
      set.players?.forEach((player) => {
        // Map team name from sold info
        let teamName = "";
        if (player.sold?.isSold) {
          const team = teams.find((t) => t.id === player.sold.team);
          if (team) teamName = team.name;
        }

        const playerObj = {
          id: player._id,
          name: player.name,
          attributes: {},
        };

        player.attributes?.forEach((attr) => {
          playerObj.attributes[attr.displayName || attr.name] = player.basePrice || attr.defaultValue;
        });

        players.push(playerObj);

        // Assign player to team if sold
        if (player.sold?.isSold && player.sold.team) {
          const team = teams.find((t) => t.id === player.sold.team);
          if (team) team.players.push(playerObj);
        }
      });
    });

    // Map auction sets
    const auctionSets = (auction.sets || []).map((set, index) => ({
      id: set._id,
      name: set.name,
      players: set.players.map((p) => p._id),
      order: "sequential", // or use set.order if needed
    }));

    return {
      id: auction._id,
      name: auction.name,
      status: auction.status || "draft",
      shortDesc: auction.description || "",
      detailedDesc: auction.description || "",
      startDate: auction.startTime,
      timePerBid: auction.settings?.bidTimeLimit || 30,
      teams,
      attributes,
      players,
      auctionSets,
    };
  });
};


const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [editingAuctionId, setEditingAuctionId] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [auctions, setAuctions] = useState([]);
  const [apiResponse, setApiResponse] = useState(null);

  // Fetch auctions from API
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await fetch("http://localhost:4000/auctionMeta/admin");
        const data = await res.json();
        setApiResponse(data);
        // console.log(data)

        // Transform API response into your state format
        const formatted = transformApiToAuctions(data);
setAuctions(formatted);
        console.log(formatted)
        // setAuctions(formatted);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };

    fetchAuctions();
  }, []);

  // Warn user before leaving if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setEditingAuctionId={setEditingAuctionId}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === "home" && <HomePage auctions={auctions} />}
        {currentPage === "dashboard" && (
          <DashboardPage
            auctions={auctions}
            setEditingAuctionId={setEditingAuctionId}
            setCurrentPage={setCurrentPage}
            setAuctions={setAuctions}
          />
        )}
        {currentPage === "create" && (
          <CreateAuction
            editingAuctionId={editingAuctionId}
            setEditingAuctionId={setEditingAuctionId}
            auctions={auctions}
            setAuctions={setAuctions}
            setCurrentPage={setCurrentPage}
            hasUnsavedChanges={hasUnsavedChanges}
            setHasUnsavedChanges={setHasUnsavedChanges}
            transformApiToAuctions= {transformApiToAuctions}

          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
