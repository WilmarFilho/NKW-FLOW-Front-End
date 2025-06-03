import { NavLink } from "react-router-dom";
import "./sidebar.css";

import LogoIcon from "./assets/logo.svg";
import ConversasIcon from "./assets/chat.svg";
import AtendenteIcon from "./assets/atendentes.svg";
import AgenteIcon from "./assets/bot.svg";
import ConexaoIcon from "./assets/conexao.svg";
import ConfigIcon from "./assets/config.svg";
import AjudaIcon from "./assets/ajuda.svg";
import LogoutIcon from "./assets/logout.svg";

const Sidebar = () => {
  const user = {
    name: "Wilmar Filho",
    email: "oftheguizo32@gmail.com", // Cuidado ao expor e-mails diretamente
    avatarUrl: "https://avatars.githubusercontent.com/u/103720085?v=4", // URL do avatar
  };

  const MenuItem = ({
    to,
    children,
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <NavLink to={to}>
      {({ isActive }) => (
        <div className={`${isActive ? "active-link" : ""}`}>{children}</div>
      )}
    </NavLink>
  );

  return (
    <div className="sidebar">
      <div className="logo">
        <LogoIcon />
      </div>

      <nav className="menu-principal">
        <p>Menu Principal</p>
        <MenuItem to="/conversas">
          {" "}
          <ConversasIcon /> Conversas
        </MenuItem>
        <MenuItem to="/atendentes">
          {" "}
          <AtendenteIcon /> Atendentes
        </MenuItem>
        <MenuItem to="/agentes">
          {" "}
          <AgenteIcon /> Agentes
        </MenuItem>
        <MenuItem to="/conexoes">
          {" "}
          <ConexaoIcon /> Conexões
        </MenuItem>
      </nav>

      <nav className="suporte-menu">
        <p>Suporte</p>
        <MenuItem to="/configuracoes">
          {" "}
          <ConfigIcon /> Configuracoes
        </MenuItem>
        <MenuItem to="/ajuda">
          {" "}
          <AjudaIcon /> Ajuda
        </MenuItem>
      </nav>

      <div className="user-menu">
        <div>
          <img src={user.avatarUrl} alt={user.name} className="user-avatar" />
          <div className="user-info">
            <p className="user-name">{user.name}</p>
            <p className="user-email">{user.email}</p>
          </div>
        </div>
        <LogoutIcon />
      </div>
    </div>
  );
};

export default Sidebar;
