import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../../components/auction/captain/CaptainSidebar.jsx";
import CaptainNavbar from "../../../components/auction/captain/CaptainNavbar.jsx";

const Captain = () => {
  return (
    <div className="text-default min-h-screen bg-white">

      <CaptainNavbar></CaptainNavbar>
      <div className="flex">
        <Sidebar></Sidebar>
        <div className="flex-1"> {<Outlet></Outlet>}</div>
      </div>
    </div>
  );
};

export default Captain;