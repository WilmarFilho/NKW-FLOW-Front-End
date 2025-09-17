import { NavLink } from 'react-router-dom';
import Icon from '../../../components/Gerais/Icons/Icons';
import { useRecoilValue } from 'recoil';
import { userState } from '../../../state/atom';
import { menuItems } from '../../../hooks/utils/useMenuItens';
import DefaultImage from '../assets/default.webp'

const Sidebar = () => {
  const user = useRecoilValue(userState);
  if (!user) return

  const MenuItem = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <NavLink to={to} className={({ isActive }) => `MenuItem ${isActive ? 'active-link' : ''}`}>
      {children}
    </NavLink>
  );

  const principalItems = menuItems.filter(
    (item) => item.section === 'principal' && item.roles.includes(user?.tipo_de_usuario)
  );

  const suporteItems = menuItems.filter(
    (item) => item.section === 'suporte' && item.roles.includes(user?.tipo_de_usuario)
  );

  const fotoPerfil = user.foto_perfil || DefaultImage

  return (
    <>
      <div className='box-logo'>
        <Icon nome='logo' />
      </div>

      <nav className='principal-menu'>
        <h4>Menu Principal</h4>
        {principalItems.map((item) => (
          <MenuItem key={item.key} to={item.to}>
            <Icon nome={item.icon} /> {item.label}
          </MenuItem>
        ))}
      </nav>

      <nav className='suporte-menu'>
        <h4>Suporte</h4>
        {suporteItems.map((item) => (
          <MenuItem key={item.key} to={item.to}>
            <Icon nome={item.icon} /> {item.label}
          </MenuItem>
        ))}
      </nav>

      <div className='user-menu'>
        <div className='column-info'>
          {user.tipo_de_usuario === 'admin' &&
            <NavLink style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} to='/configuracoes'>
              <div className='MenuImage'>
                <img src={fotoPerfil} alt={user?.nome} />
              </div>
            </NavLink>
          }
          <div className='user-info'>
            <p className='user-name'>{user?.nome}</p>
            <p className='user-email'>{user?.email}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;