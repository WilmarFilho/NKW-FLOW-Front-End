//Libbs
import { Outlet } from 'react-router-dom';
//Components
import Sidebar from './Sidebars/Sidebar';
import SidebarClosed from './Sidebars/SidebarClosed';
//Hooks
import { useRealtimeEvents } from '../../hooks/events/useRealtimeEvents';
//Css
import './Layout.css';

export default function Layout() {

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
