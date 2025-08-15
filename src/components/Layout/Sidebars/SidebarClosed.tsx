//Libbs
import { NavLink } from 'react-router-dom';
//Css
import './sidebarclosed.css';
//Icons
import Icon from '../../../components/Gerais/Icons/Icons';

const SidebarClosed = () => {
  const MenuItem = ({
    to,
    children,
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `MenuItem ${isActive ? 'active-link' : ''}`
      }
    >
      {children}
    </NavLink>
  );

  return (
    <>
      <nav className="menu-principal-closed">
        <div className='itens-list-menu'>

          <MenuItem to="/dashboard">
            <Icon nome='resumopage' />
          </MenuItem>

          <MenuItem to="/conversas">
            <Icon nome='conversaspage' />
          </MenuItem>

          <MenuItem to="/atendentes">
            <Icon nome='atendentespage' />
          </MenuItem>

          <MenuItem to="/agentes">
            <Icon nome='agentespage' />
          </MenuItem>

          <MenuItem to="/conexoes">
            <Icon nome='conexaopage' />
          </MenuItem>

          <MenuItem to="/configuracoes">
            <Icon nome='configpage' />
          </MenuItem>
          <MenuItem to="/cashback">
            <Icon nome='recompensapage' />
          </MenuItem>
          <MenuItem to="/ajuda">
            <Icon nome='ajudapage' />
          </MenuItem>
        </div>
      </nav>
    </>
  );
};

export default SidebarClosed;