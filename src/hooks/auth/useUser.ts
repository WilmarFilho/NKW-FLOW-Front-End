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
import { useChats } from '../chats/useChats';
import { Chat } from '../../types/chats';

export const useUser = () => {

  // Carrega Usuário
  const [user, setUser] = useRecoilState(userState);

  // Carrega todos fetch dos modelos do Usuário
  const { fetchAttendants } = useAttendants();
  const { fetchAgents } = useAgents();
  const { fetchConnections } = useConnections();
  const { fetchChats } = useChats();

  // Carrega Metodos do hook da api
  const { get } = useApi();

  // Auth
  const [token] = useRecoilState(authTokenState);
  const userId = token?.userId;

  const updateDocumentTitle = (chats: Chat[]) => {
    const unreadCount = chats.filter(c => c.unread_count > 0).length;
    document.title = unreadCount > 0 ? `(${unreadCount}) WhatsApp - NKW FLOW` : 'WhatsApp - NKW FLOW';
  };


  const fetchUser = useCallback(async (opts?: { force?: boolean }) => {

    if (!token || !userId) return null;

    if (!opts?.force && user) return user;

    const fetchedUser = await get<User>(`/users/${userId}`);

    if (fetchedUser) {
      setUser(fetchedUser);

      fetchAttendants(fetchedUser);
      fetchAgents();
      fetchConnections(fetchedUser);

      const chats = await fetchChats(fetchedUser);
      if (chats) updateDocumentTitle(chats); 

    }
  }, [token, userId, setUser, get, fetchAttendants, fetchAgents, fetchConnections, fetchChats]);


  return { fetchUser };
}