import { Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

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

  const { fetchUser } = useUser();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const user = useRecoilValue(userState);

  const modoTela = user?.modo_tela || 'dark';

  useRealtimeEvents(user?.id);

  const body = document.body;

  body.classList.remove('modo-light', 'modo-dark');

  if (user?.modo_tela === 'White') {
    body.classList.add('modo-light');
  } else {
    body.classList.add('modo-dark');
  }

  return (
    <div className={`${styles.layoutContainer} ${modoTela === 'White' ? styles.light : styles.dark}`}>
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