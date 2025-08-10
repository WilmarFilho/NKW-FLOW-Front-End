// Libs
import { useCallback } from 'react';
// Recoil
import { useRecoilState } from 'recoil';
import { chatsState } from '../../state/atom';
// Hooks
import { useApi } from '../utils/useApi';
// Types
import type { Chat } from '../../types/chats';

export default function useChats() {
  const [chats, setChats] = useRecoilState(chatsState);
  const { get, put} = useApi();

  const fetchChats = useCallback(async (userId: string) => {
    if (!userId) {
      setChats([]);
      return;
    }
    const data = await get<Chat[]>(`/chats/connections/chats/${userId}`);
    if (data) {
      setChats(data);
    }
  }, [get, setChats]);

   const fectchImageProfile = async (chatId: string) => {
    const updatedChat = await put<Chat>(`/chats/fetchImage/${chatId}`);
    return updatedChat;
  };

  return { chats, fetchChats, fectchImageProfile};
}
