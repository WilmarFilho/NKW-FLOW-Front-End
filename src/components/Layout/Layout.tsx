import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebars/Sidebar';
import SidebarClosed from './Sidebars/SidebarClosed';
import './Layout.css';
import { useRealtimeEvents } from '../../hooks/useRealtimeEvents';

const Layout = () => {


  const userId = '0523e7bd-314c-43c1-abaa-98b789c644e6';
  useRealtimeEvents(userId);



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
