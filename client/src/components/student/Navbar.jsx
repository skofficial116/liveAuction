// import React, { use } from "react";
import { Button, Stack } from "@mui/material";

import { useParams } from "react-router-dom";

const Navbar = () => {
  const { userType, action } = useParams();

  console.log(action);
  // console.log(userType);
  if (userType === "captain") {
    return (
      <div className="flex justify-center items-center gap-4 p-4 bg-cyan-100/90 shadow-md">
        <Stack direction="row" spacing={2}>
          <Button variant="contained" href="/captain/currentBid">
            Current
          </Button>
          <Button variant="contained" href="/captain/auctionHistory">
            History
          </Button>
          <Button variant="contained" href="/captain/allTeams">
            Teams
          </Button>
          <Button variant="contained" href="/captain/myTeam">
            My Team{" "}
          </Button>
        </Stack>
      </div>
    );
  } else if (userType === "audience") {
    return (
      <div className="flex justify-center items-center gap-4 p-4 bg-cyan-100/90 shadow-md">
        <Stack direction="row" spacing={2}>
          <Button variant="contained" href="/audience/currentBid">
            Current
          </Button>
          <Button variant="contained" href="/audience/auctionHistory">
            History
          </Button>
          <Button variant="contained" href="/audience/allTeams">
            Teams
          </Button>
        </Stack>
      </div>
    );
  } else if (userType === "admin") {
    return (
      <div className="flex justify-center items-center gap-4 p-4 bg-cyan-100/90 shadow-md">
        <Stack direction="row" spacing={2}>
          <Button variant="contained" href="/admin/currentBid">
            Current
          </Button>
          <Button variant="contained" href="/admin/auctionHistory">
            History
          </Button>
          <Button variant="contained" href="/admin/allTeams">
            Teams
          </Button>
          <Button variant="contained" href="/admin/manageSets">
            Manage Sets
          </Button>
          <Button variant="contained" href="/admin/managePlayers">
            Manage Players
          </Button>
          <Button variant="contained" href="/admin/settings">
            Settings
          </Button>
        </Stack>
      </div>
    );
  }
};

export default Navbar;
