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

    console.log('oi')

    const token = '123' +  email + senha
    const userId = '807cc327-34ec-43b7-abc1-7f4def7d15c6'

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