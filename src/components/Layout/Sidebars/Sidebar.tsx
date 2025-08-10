//Libbs
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
//Hooks
import { useAuth } from '../../../hooks/auth/useAuth';
//Css
import './sidebar.css';
//Assets
import LogoIcon from '../assets/logo.svg';
import ConversasIcon from '../assets/chat.svg';
import AtendenteIcon from '../assets/atendentes.svg';
import AgenteIcon from '../assets/bot.svg';
import ConexaoIcon from '../assets/conexao.svg';
import ConfigIcon from '../assets/config.svg';
import AjudaIcon from '../assets/ajuda.svg';
import DashIcon from '../assets/dash.svg'
import GiftIcon from '../assets/gift.svg'
import LogoutIcon from '../assets/logout.svg';
import { useRecoilState } from 'recoil';
import { userState } from '../../../state/atom';

const Sidebar = () => {

  const [user] = useRecoilState(userState)

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const sidebarElement = document.querySelector('.sidebar');
    const sidebarClosedElement = document.querySelector('.sidebarclosed');
    if (sidebarElement) {
      if (isSidebarOpen) {
        sidebarElement.classList.add('sidebar-is-open');
        sidebarClosedElement?.classList.add('sidebarclosed-is-open');
      } else {
        sidebarElement.classList.remove('sidebar-is-open');
        sidebarClosedElement?.classList.remove('sidebarclosed-is-open');
      }
    }
  }, [isSidebarOpen]);

  const MenuItem = ({
    to,
    children,
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <NavLink to={to}>
      <NavLink
        to={to}
        // A classe agora é aplicada diretamente no NavLink (que vira uma tag <a>)
        className={({ isActive }) =>
          `MenuItem ${isActive ? 'active-link' : ''}`
        }
      >
        {children}
      </NavLink>
    </NavLink>
  );

  return (
    <>
      <div className="box-logo">
        <LogoIcon />
      </div>

      <nav className="principal-menu">
        <h4>Menu Principal</h4>
        <MenuItem to="/dashboard">
          <DashIcon /> Resumo
        </MenuItem>
        <MenuItem to="/conversas">
          <ConversasIcon /> Conversas
        </MenuItem>
        <MenuItem to="/atendentes">
          <AtendenteIcon /> Atendentes
        </MenuItem>
        <MenuItem to="/agentes">
          <AgenteIcon /> Agentes
        </MenuItem>
        <MenuItem to="/conexoes">
          <ConexaoIcon /> Conexões
        </MenuItem>
      </nav>

      <nav className="suporte-menu">
        <h4>Suporte</h4>
        <MenuItem to="/configuracoes">
          {' '}
          <ConfigIcon /> Configuracoes
        </MenuItem>
         <MenuItem to="/cashback">
          {' '}
          <GiftIcon /> Recompensas
        </MenuItem>
        <MenuItem to="/ajuda">
          {' '}
          <AjudaIcon /> Ajuda
        </MenuItem>
      </nav>

      <div className="user-menu">
        <div className="column-info">
          <NavLink to='/configuracoes'>
            <div className="MenuImage">
              <img src={user?.foto_perfil} alt={user?.nome} className="user-avatar" />
            </div>
          </NavLink>

          <div className="user-info">
            <p className="user-name">{user?.nome}</p>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>

      </div>
    </>
  );
};

export default Sidebar;