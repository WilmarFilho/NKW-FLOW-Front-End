import { useState, useEffect } from 'react';
import { useUser } from '../../hooks/auth/useUser';
import LoadingScreen from '../Layout/LoadingScreen';
import { useRecoilValue } from 'recoil';
import { authTokenState } from '../../state/atom';

interface AuthInitializerProps {
  children: React.ReactNode;
}
export const AuthInitializer = ({ children }: AuthInitializerProps) => {
  const { fetchUser } = useUser();
  const [isInitializing, setIsInitializing] = useState(true);
  const [progressMessage, setProgressMessage] = useState('Iniciando...');
  const token = useRecoilValue(authTokenState);

  useEffect(() => {
    if (!token || !isInitializing) return;

    const initializeAuth = async () => {
      try {
        await fetchUser({
          force: true,
          onProgress: (msg) => setProgressMessage(msg),
        });
      } catch (error) {
        console.error('Falha ao inicializar a sessão do usuário', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [token, isInitializing]);

  if (isInitializing) {
    return <LoadingScreen message={progressMessage} />;
  }

  return <>{children}</>;
};