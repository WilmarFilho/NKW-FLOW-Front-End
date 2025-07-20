import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebars/Sidebar';
import SidebarClosed from './Sidebars/SidebarClosed';
import './Layout.css';

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
