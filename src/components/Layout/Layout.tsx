import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebars/Sidebar';
import SidebarClosed from './Sidebars/SidebarClosed';
import './Layout.css';

const Layout = () => {

 

  return (
    <div className="layout-container">

      <SidebarClosed />

      <Sidebar />

      <div className='wrapper-border'><div className='border'></div></div>

      <main className="content-area">
        <Outlet />
      </main>

    </div>
  );
};

export default Layout;
