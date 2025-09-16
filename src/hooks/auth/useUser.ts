// Libs
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
// Recoil
import { userState, authTokenState } from '../../state/atom';
// Hooks
import { useApi } from '../utils/useApi';
// Types
import type { User } from '../../types/user';
// Modelos do Usuário
import { useAttendants } from '../attendants/useAttendants';
import { useAgents } from '../agents/useAgents';
import { useConnections } from '../connections/useConnections';
import { useMetrics } from '../metrics/useMetrics';

export const useUser = () => {

  // Carrega Usuário
  const [user, setUser] = useRecoilState(userState);

  // Carrega todos fetch dos modelos do Usuário
  const { fetchAttendants } = useAttendants();
  const { fetchAgents } = useAgents();
  const { fetchConnections } = useConnections();
  const { fetchMetrics } = useMetrics();

  // Carrega Metodos do hook da api
  const { get } = useApi();

  // Auth
  const [token] = useRecoilState(authTokenState);

  const fetchUser = useCallback(
    async (opts?: { force?: boolean; onProgress?: (msg: string) => void }) => {
      if (!token?.token || !token.userId) return null;
      if (!opts?.force && user) return user;

      const fetchedUser = await get<User>('/users', {
        params: {
          user_id: token.userId,
          token: token.token, // token agora vai via query
        },
      });

      if (fetchedUser) {
        setUser(fetchedUser);

        opts?.onProgress?.('Carregando conversas...');
        await fetchAttendants(fetchedUser);

        opts?.onProgress?.('Carregando agentes...');
        await fetchAgents(fetchedUser);

        opts?.onProgress?.('Carregando conexões...');
        await fetchConnections(fetchedUser);

        opts?.onProgress?.('Carregando métricas...');
        await fetchMetrics(fetchedUser);
      }

      return fetchedUser;
    },
    [token, user, setUser, get]
  );

  return { fetchUser };
}





