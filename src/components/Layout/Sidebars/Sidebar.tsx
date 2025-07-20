import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';

import './sidebar.css';

import LogoIcon from '../assets/logo.svg';
import ConversasIcon from '../assets/chat.svg';
import AtendenteIcon from '../assets/atendentes.svg';
import AgenteIcon from '../assets/bot.svg';
import ConexaoIcon from '../assets/conexao.svg';
import ConfigIcon from '../assets/config.svg';
import AjudaIcon from '../assets/ajuda.svg';
import ExpandIcon from '../assets/expand.svg';
import LogoutIcon from '../assets/logout.svg';

const Sidebar = () => {
  const user = {
    name: 'Wilmar Filho',
    email: 'oftheguizo32@gmail.com', // Cuidado ao expor e-mails diretamente
    avatarUrl: 'https://avatars.githubusercontent.com/u/103720085?v=4', // URL do avatar
  };

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
      {({ isActive }) => (
        <div className={` MenuItem ${isActive ? 'active-link' : ''} `}>
          {children}
        </div>
      )}
    </NavLink>
  );

  return (
    <div className="sidebar">
      <div className="box-logo">
        <LogoIcon />
      </div>

      <nav className="principal-menu">
        <h4>Menu Principal</h4>
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
        <MenuItem to="/ajuda">
          {' '}
          <AjudaIcon /> Ajuda
        </MenuItem>
      </nav>

      <div className="user-menu">
        <div className="column-info">
          <img src={user.avatarUrl} alt={user.name} className="user-avatar" />
          <div className="user-info">
            <p className="user-name">{user.name}</p>
            <p className="user-email">{user.email}</p>
          </div>
        </div>

        <div className="column-links">
          <div className="MenuItem" onClick={toggleSidebar}>
            <ExpandIcon />
          </div>
          <div className="MenuItem" onClick={handleLogout}>
            <LogoutIcon />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
