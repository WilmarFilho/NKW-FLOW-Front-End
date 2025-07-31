import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { chatsState } from '../../state/atom';
import { useApi } from '../utils/useApi'; 
import type { Chat } from '../../types/chats';

export default function useChats(userId: string | null | undefined, agentId?: string | null) {
  const [chats, setChats] = useRecoilState(chatsState);
  const { get } = useApi<Chat[]>();

  useEffect(() => {
    if (!userId) {
      setChats([]);
      return;
    }

    const fetchChats = async () => {
      const query = agentId ? `?agente_id=${agentId}` : '';
      const data = await get(`/chats/connections/chats/${userId}${query}`);

      if (data) {
        console.log(data)
        setChats(data);
      } else {
        setChats([]);
      }
    };

    fetchChats();
  }, [userId, agentId, get, setChats]);

  return { chats };
}
