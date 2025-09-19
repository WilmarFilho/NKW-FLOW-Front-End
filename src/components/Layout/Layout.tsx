import { Outlet } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ToastContainer } from 'react-toastify';
// Components
import SidebarWrapper from './Sidebars/SidebarWrapper';
// Hooks
import { useRealtimeEvents } from '../../hooks/utils/useRealtimeEvents';
// State
import { authTokenState, userState } from '../../state/atom';
// Estilos
import styles from './Layout.module.css';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout() {

  const user = useRecoilValue(userState);
  const [token] = useRecoilState(authTokenState);

  if (token === null || user === null) {
    return <></>;
  }

  const modoTela = user.modo_tela || 'dark';
  const modoSideBar = user.modo_side_bar || 'Full';

  useRealtimeEvents(token.userId, token.token);

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

      <main className={`${modoSideBar === 'Full' ? styles.contentAreaMinimal : styles.contentArea}`}>
        <Outlet />
      </main>
    </div>
  );
}