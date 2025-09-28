import { Outlet } from "react-router-dom";
// import Sidebar from "../../../components/educator/Sidebar";
import AdminNavbar from "../../../components/auction/admin/AdminNavbar.jsx";
import Sidebar from "../../../components/auction/admin/AdminSidebar.jsx";
const Admin = () => {
  return (
    <div className="text-default min-h-screen bg-white">
      {/* <Navbar></Navbar> */}
      <AdminNavbar></AdminNavbar>
      <div className="flex">
        <Sidebar></Sidebar>
        <div className="flex-1"> {<Outlet></Outlet>}</div>
      </div>
    </div>
  );
};

export default Admin;
