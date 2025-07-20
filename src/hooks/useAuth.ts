import { useRecoilState } from 'recoil';
import { authTokenState } from '../state/atom';

export const useAuth = () => {
  const [token, setToken] = useRecoilState(authTokenState);

  const login = (newToken: string) => setToken(newToken);
  const logout = () => setToken(null);
  const isAuthenticated = !!token;

  return { token, isAuthenticated, login, logout };
};
