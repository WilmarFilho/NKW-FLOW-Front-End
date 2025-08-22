import { useRecoilState } from 'recoil';
// Recoil
import { authTokenState, userState } from '../../state/atom';

export const useAuth = () => {

  
  const [token, setToken] = useRecoilState(authTokenState);

  const [user, setUser] = useRecoilState(userState);

  const login = async (email: string, senha: string) => {

    const token = '123' + email + senha;

    //const userId = '949c16e4-c76b-474b-9770-c6938b10de15'; 
    const userId = '807cc327-34ec-43b7-abc1-7f4def7d15c6'; 
    //const userId = '64bed13c-fa9c-47fa-9cc1-6c07ff98a0d3'; 

    // 807cc327-34ec-43b7-abc1-7f4def7d15c6
    // 949c16e4-c76b-474b-9770-c6938b10de15  ATENDENTE
    // outro admin 64bed13c-fa9c-47fa-9cc1-6c07ff98a0d3

    setToken({ token: token, userId: userId });

  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return { token, isAuthenticated, login, logout, user };
};