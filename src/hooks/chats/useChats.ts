// Libs
import { useEffect, useCallback } from 'react';
// Recoil
import { useRecoilState } from 'recoil';
import { chatsState } from '../../state/atom';
// Hooks
import { useApi } from '../utils/useApi';
// Types
import type { Chat } from '../../types/chats';

export default function useChats(userId: string | null | undefined) {
  const [chats, setChats] = useRecoilState(chatsState);
  const { get, del, put } = useApi();

  const fetchChats = useCallback(async () => {
    
    if (!userId) {
      setChats([]);
      return;
    }

    const data = await get<Chat[]>(`/chats/connections/chats/${userId}`);
    if (data) setChats(data);
    else setChats([]);
  }, [userId, get]);

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

  const reOpenChat = async (chatId: string, status: string) => {
    const result = await put(`/chats/${chatId}`, { status: status });
    if (result) {
      setChats((prev) =>
        prev.map((chat) => (chat.id === chatId ? { ...chat, status: status } : chat))
      );
    }
    return result;
  };

  const fectchImageProfile = async (chatId: string) => {
    const updatedChat = await put<Chat>(`/chats/fetchImage/${chatId}`);
    return updatedChat;
  };

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return { chats, refetch: fetchChats, deleteChat, renameChat, fectchImageProfile, reOpenChat };
}