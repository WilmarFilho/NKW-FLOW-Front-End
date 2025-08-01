//Libbs
import { Outlet } from 'react-router-dom';
//Components
import SidebarWrapper from './Sidebars/SidebarWrapper';
//Hooks
import { useRealtimeEvents } from '../../hooks/events/useRealtimeEvents';
//Css
import './Layout.css';
import 'react-toastify/dist/ReactToastify.css';
//Libbs
import { useRecoilState } from 'recoil';
import { userState } from '../../state/atom';
import { useUser } from '../../hooks/auth/useUser';
import { ToastContainer } from 'react-toastify';

//<div className='wrapper-border'><div className='border'></div></div>


export default function Layout() {
  useUser();
  const [user] = useRecoilState(userState);

  useRealtimeEvents(user?.id); // ← HOOK sempre na raiz

  return (
    <div className="layout-container">

      <ToastContainer
        position="bottom-right"
        autoClose={2000}
      />


      <SidebarWrapper />
      
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
}

