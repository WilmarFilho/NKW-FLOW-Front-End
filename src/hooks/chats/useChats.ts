// Libs
import { useCallback } from 'react';
// Recoil
import { useRecoilState } from 'recoil';
import { chatsState, userState } from '../../state/atom';
// Hooks
import { useApi } from '../utils/useApi';
// Types
import type { Chat } from '../../types/chats';
import { User } from '../../types/user';

export default function useChats() {
  const [user] = useRecoilState(userState)
  const [chats, setChats] = useRecoilState(chatsState);
  const { get, put } = useApi();

  const fetchChats = useCallback(async (userParam?: User) => {

    const currentUser = userParam ?? user;
    if (!currentUser) return;

    const data = await get<Chat[]>(`/chats/connections/chats/${currentUser.id}`);
    if (data) {
      setChats(data);
    }
  }, [get, setChats]);

  const fectchImageProfile = async (chatId: string) => {
    const updatedChat = await put<Chat>(`/chats/fetchImage/${chatId}`);
    return updatedChat;
  };

  return { fetchChats, fectchImageProfile };
}