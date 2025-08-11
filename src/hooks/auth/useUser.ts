// Libs
import { useRecoilState } from 'recoil';
// Atom
import { userState, authTokenState } from '../../state/atom';
// Types
import type { User } from '../../types/user';
// Utils
import { useApi } from '../utils/useApi';
import { useCallback } from 'react';
import { useAttendants } from '../attendants/useAttendants';
import { useAgents } from '../agents/useAgents';
import { useConnections } from '../connections/useConnections';
import useChats from '../chats/useChats';

export function useUser() {
  const [user, setUser] = useRecoilState(userState);
  const { fetchAttendants } = useAttendants();
  const { fetchAgents } = useAgents();
  const { fetchConnections } = useConnections();
  const { fetchChats } = useChats();
  const [token] = useRecoilState(authTokenState);
  const { get } = useApi();
  const userId = localStorage.getItem('userId');

  const fetchUser = useCallback(async (opts?: { force?: boolean }) => {

    if (!token || !userId) return null;
    if (!opts?.force && user) return user;
    const fetchedUser = await get<User>(`/users/${userId}`);
    if (fetchedUser) {
      setUser(fetchedUser);
      // Carrega no topo os dados do usuário
      fetchAttendants(fetchedUser);
      fetchAgents();
      fetchConnections(fetchedUser);
      fetchChats(fetchedUser);
    }

  }, [token, userId, user, setUser, get]);

  return { fetchUser };
}