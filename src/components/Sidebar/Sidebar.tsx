import { NavLink } from 'react-router-dom';
import './sidebar.css';


const Sidebar = () => {
  const user = {
    name: 'Wilmar Filho',
    email: 'ofthieguiiiii28@gmail.com', // Cuidado ao expor e-mails diretamente
    avatarUrl: 'https://via.placeholder.com/40' // URL do avatar
  };

  return (
    <div className="sidebar">
      <div className="logo">NKW FLOW</div>
      <nav className="menu-principal">
        <NavLink to="/conversas" className={({ isActive }) => isActive ? 'active-link' : ''}>Conversas</NavLink>
        <NavLink to="/atendentes" className={({ isActive }) => isActive ? 'active-link' : ''}>Atendentes</NavLink>
        <NavLink to="/agentes" className={({ isActive }) => isActive ? 'active-link' : ''}>Agentes</NavLink>
        <NavLink to="/conexoes" className={({ isActive }) => isActive ? 'active-link' : ''}>Conexões</NavLink>
      </nav>
      <div className="suporte-menu">
        <p>Suporte</p>
        <NavLink to="/configuracoes" className={({ isActive }) => isActive ? 'active-link' : ''}>Configurações</NavLink>
        <NavLink to="/ajuda" className={({ isActive }) => isActive ? 'active-link' : ''}>Ajuda</NavLink>
      </div>
      <div className="user-info">
        <img src={user.avatarUrl} alt={user.name} className="user-avatar" />
        <div>
          <p className="user-name">{user.name}</p>
          <p className="user-email">{user.email}</p>
        </div>
        {/* Ícone de logout ou configurações do usuário aqui */}
      </div>
    </div>
  );
};



export default Sidebar;