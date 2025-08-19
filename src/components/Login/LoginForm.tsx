// Libs
import { useState } from 'react';
// Hooks
import { useAuth } from '../../hooks/auth/useAuth';
// Css
import styles from './LoginForm.module.css';
// Icon
import Icon from '../Gerais/Icons/Icons';

export default function LoginForm() {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const { login } = useAuth();

    const handleLogin = async () => {
        try {
            await login(email, senha);
        } catch (err) {
            alert('Falha ao fazer login: ' + err);
        }
        
    };

    return (
        <div className={styles.loginBox}>

            <div className={styles.wrapperLogo}>
                <Icon nome='logo' />
            </div>

            <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='E-mail'
            />
            <input
                type='password'
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder='Senha'
            />
            <button onClick={handleLogin}>Entrar</button>
        </div>
    );
}