//Libbs
import { NavLink } from 'react-router-dom';
//Css
import './sidebar.css';
//Icons
import Icon from '../../../components/Gerais/Icons/Icons';
//Atom
import { useRecoilState } from 'recoil';
import { userState } from '../../../state/atom';

const Sidebar = () => {

  const [user] = useRecoilState(userState)

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
      <div className="box-logo">
        <Icon nome='logo' />
      </div>

      <nav className="principal-menu">
        <h4>Menu Principal</h4>
        <MenuItem to="/dashboard">
          <Icon nome='resumopage' /> Resumo
        </MenuItem>
        <MenuItem to="/conversas">
          <Icon nome='conversaspage' /> Conversas
        </MenuItem>
        <MenuItem to="/atendentes">
          <Icon nome='atendentespage' /> Atendentes
        </MenuItem>
        <MenuItem to="/agentes">
          <Icon nome='agentespage' /> Agentes
        </MenuItem>
        <MenuItem to="/conexoes">
          <Icon nome='conexaopage' /> Conexões
        </MenuItem>
      </nav>

      <nav className="suporte-menu">
        <h4>Suporte</h4>
        <MenuItem to="/configuracoes">
          {' '}
          <Icon nome='configpage' /> Configuracoes
        </MenuItem>
        <MenuItem to="/cashback">
          {' '}
          <Icon nome='recompensapage' /> Recompensas
        </MenuItem>
        <MenuItem to="/ajuda">
          {' '}
          <Icon nome='ajudapage' /> Ajuda
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