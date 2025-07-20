import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './sidebarclosed.css';

import ConversasIcon from '../assets/chat.svg';
import AtendenteIcon from '../assets/atendentes.svg';
import AgenteIcon from '../assets/bot.svg';
import ConexaoIcon from '../assets/conexao.svg';
import ExpandIcon from '../assets/expand.svg';

const SidebarClosed = () => {
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

  return (
    <div className="sidebarclosed">
      <nav className="menu-principal-closed">
        <div>
          <MenuItem to="/conversas">
            <ConversasIcon />
          </MenuItem>

          <MenuItem to="/atendentes">
            <AtendenteIcon />
          </MenuItem>

          <MenuItem to="/agentes">
            <AgenteIcon />
          </MenuItem>

          <MenuItem to="/conexoes">
            <ConexaoIcon />
          </MenuItem>
        </div>

        <div className="MenuItem" onClick={toggleSidebar}>
          <ExpandIcon />
        </div>
      </nav>
    </div>
  );
};

export default SidebarClosed;
