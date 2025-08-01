//Libbs
import { NavLink } from 'react-router-dom';
//Css
import './sidebarclosed.css';
//Assets
import ConversasIcon from '../assets/chat.svg';
import AtendenteIcon from '../assets/atendentes.svg';
import AgenteIcon from '../assets/bot.svg';
import ConexaoIcon from '../assets/conexao.svg';
import ConfigIcon from '../assets/config.svg';
import AjudaIcon from '../assets/ajuda.svg';

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

  return (
    <>
      <nav className="menu-principal-closed">
        <div className='itens-list-menu'>
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

          <MenuItem to="/configuracoes">
            <ConfigIcon />
          </MenuItem>
          <MenuItem to="/ajuda">
            <AjudaIcon />
          </MenuItem>
        </div>
      </nav>
    </>
  );
};

export default SidebarClosed;
