//Libbs
import { Outlet } from 'react-router-dom';
//Components
import Sidebar from './Sidebars/Sidebar';
import SidebarClosed from './Sidebars/SidebarClosed';
//Hooks
import { useRealtimeEvents } from '../../hooks/events/useRealtimeEvents';
//Css
import './Layout.css';
//Libbs
import { useRecoilState } from 'recoil';
import { userState } from '../../state/atom';
import { useUser } from '../../hooks/auth/useUser';

export default function Layout() {
  useUser();
  const [user] = useRecoilState(userState);

  useRealtimeEvents(user?.id); // ← HOOK sempre na raiz

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
}

