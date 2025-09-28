import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../../components/auction/audience/AudienceSidebar.jsx";
import AudienceNavbar from "../../../components/auction/audience/AudienceNavbar";

const Audience = () => {
  return (
    <div className="text-default min-h-screen bg-white">
      {/* <Navbar></Navbar> */}

      <AudienceNavbar></AudienceNavbar>
      <div className="flex">
        <Sidebar></Sidebar>
        <div className="flex-1"> {<Outlet></Outlet>}</div>
      </div>
    </div>
  );
};

export default Audience;