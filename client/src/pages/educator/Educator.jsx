import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/educator/Sidebar";

const Educator = () => {
  return (
    <div className="text-default min-h-screen bg-white">
      {/* <Navbar></Navbar> */}

      <div className="flex">
        <Sidebar></Sidebar>
        <div className="flex-1"> {<Outlet></Outlet>}</div>
      </div>
    </div>
  );
};

export default Educator;
