import { Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { ToastContainer } from 'react-toastify';

// Components
import SidebarWrapper from './Sidebars/SidebarWrapper';

// Hooks
import { useRealtimeEvents } from '../../hooks/events/useRealtimeEvents';
import { useUser } from '../../hooks/auth/useUser';

// State
import { userState } from '../../state/atom';

// Estilos
import styles from './Layout.module.css';
import 'react-toastify/dist/ReactToastify.css'; 

export default function Layout() {
  useUser(); 
  const user = useRecoilValue(userState);
  useRealtimeEvents(user?.id);

  return (
    <div className={styles.layoutContainer}>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="light" 
      />

      <SidebarWrapper />
      
      <main className={styles.contentArea}>
        <Outlet /> 
      </main>
    </div>
  );
}