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
  const token = useRecoilValue(authTokenState);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Tenta buscar o usuário baseado no token/ID do localStorage
        await fetchUser();
      } catch (error) {
        // Se a busca falhar (ex: token inválido), não há problema, o estado continuará nulo
        console.error('Falha ao inicializar a sessão do usuário', error);
      } finally {
        // Independentemente do resultado, a tentativa de inicialização terminou
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [fetchUser, token]); 

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return <>{children}</>;

};