import { useRecoilState } from 'recoil';
import { authTokenState, userState } from '../../state/atom';
import type { User } from '../../types/user';

export const useAuth = () => {
  const [token, setToken] = useRecoilState(authTokenState);
  const [user, setUser] = useRecoilState(userState);

  const login = async (email: string, senha: string) => {

    const mockUser: User = {
      id: 'user123',
      email: 'teste@teste.com',
      nome: 'Atendente A',
      tipo_de_usuario: 'atendente',
      status: true,
      modo_tela: 'Black',
      modo_side_bar: 'Full',
      mostra_nome_mensagens: true,
      modo_notificacao_atendente: false,
      notificacao_para_entrar_conversa: true,
      notificacao_necessidade_de_entrar_conversa: false,
      notificacao_novo_chat: true,
      criado_em: new Date().toISOString(),
    };

    const token = '123' +  email + senha
    const userId = '0523e7bd-314c-43c1-abaa-98b789c644e6'

    setToken({ token: token, userId: userId });

    setUser(mockUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return { token, isAuthenticated, login, logout, user };
};
