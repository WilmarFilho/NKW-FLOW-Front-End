import { useEffect, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { chatsState } from '../../state/atom';
import { useApi } from '../utils/useApi'; 
import type { Chat } from '../../types/chats';

export default function useChats(userId: string | null | undefined) {
  const [chats, setChats] = useRecoilState(chatsState);
  const { get } = useApi<Chat[]>();

  const fetchChats = useCallback(async () => {
    if (!userId) {
      setChats([]);
      return;
    }

    const data = await get(`/chats/connections/chats/${userId}`);

    if (data) {
      setChats(data);
    } else {
      setChats([]);
    }
  }, [userId, get, setChats]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return { chats, refetch: fetchChats };
}
