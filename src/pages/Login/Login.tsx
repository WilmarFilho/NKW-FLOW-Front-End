// Libbs
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Hooks
import { useAuth } from '../../hooks/auth/useAuth';
// Assets
import LogoIcon from './assets/logo.svg';
//Css
import styles from './Login.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {

    login(email, senha);

    navigate('/conexoes');
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>

        <div className={styles.wrapperLogo}>
          <LogoIcon />
        </div>


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