// Libs
import { useRecoilState } from 'recoil';
// Recoil
import { authTokenState, userState } from '../../state/atom';
// Types
import type { User } from '../../types/user';
// Hooks
import { useApi } from '../utils/useApi';

export const useAuth = () => {
  const [token, setToken] = useRecoilState(authTokenState);
  const [user, setUser] = useRecoilState(userState);
  const { get } = useApi();

  const login = async (email: string, senha: string) => {

    const token = '123' +  email + senha
    const userId = '419da23a-5461-470c-a837-d79fa2bb2f0c'

    const fetchedUser = await get<User>(`/users/${userId}`);

    setToken({ token: token, userId: userId });

    setUser(fetchedUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return { token, isAuthenticated, login, logout, user };
};
