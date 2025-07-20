import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LogoIcon from "./assets/logo.svg";
import './login.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const fakeToken = 'abc123token';
    login(fakeToken);
    navigate('/conexoes');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <LogoIcon />
        
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
        />
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha"
        />
        
        <button onClick={handleLogin}>Entrar</button>
      </div>
    </div>
  );
};

export default LoginPage;
