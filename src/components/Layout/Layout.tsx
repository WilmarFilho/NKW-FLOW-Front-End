import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import SidebarClosed from "../SidebarClosed/SidebarClosed";
import "./Layout.css";

const Layout = () => {

 

  return (
    <div className="layout-container">

      <SidebarClosed />

      <Sidebar />

      <main className="content-area">
        <Outlet />
      </main>

    </div>
  );
};

export default Layout;
