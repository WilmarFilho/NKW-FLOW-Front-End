import { useEffect, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { chatsState } from '../../state/atom';
import { useApi } from '../utils/useApi';
import type { Chat } from '../../types/chats';

export default function useChats(userId: string | null | undefined) {
  const [chats, setChats] = useRecoilState(chatsState);
  const { get, del, put } = useApi<Chat[]>();

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

  const deleteChat = async (chatId: string) => {
    const result = await del(`/chats/${chatId}`);
    if (result) {
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    }
    return result;
  };

  const renameChat = async (chatId: string, newName: string) => {
    const result = await put(`/chats/${chatId}`, { contato_nome: newName });
    if (result) {
      setChats((prev) =>
        prev.map((chat) => (chat.id === chatId ? { ...chat, contato_nome: newName } : chat))
      );
    }
    return result;
  };

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return { chats, refetch: fetchChats,  deleteChat, renameChat  };
}
