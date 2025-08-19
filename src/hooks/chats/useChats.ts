// Libs
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
// Recoilt
import { chatsState, userState } from '../../state/atom';
// Hooks
import { useApi } from '../utils/useApi';
// Types
import type { Chat } from '../../types/chats';
import { User } from '../../types/user';

export const useChats = () => {

  // Carrega Usuário
  const [user] = useRecoilState(userState)

  // Carrega Chats
  const [chats, setChats] = useRecoilState(chatsState);

  // Carrega Metodos do hook da api
  const { get, put } = useApi();

  const fetchChats = useCallback(async (userParam?: User) => {

    const currentUser = userParam ?? user;
    if (!currentUser) return;

    const data = await get<Chat[]>(`/chats/connections/chats/${currentUser.id}`);

    if (data) {
      
      setChats(data);
      return data; 
    }
    
  }, [get, setChats]);

  const fectchImageProfile = async (chatId: string) => {
    const updatedChat = await put<Chat>(`/chats/fetchImage/${chatId}`);
    return updatedChat;
  };

  return { fetchChats, fectchImageProfile };
}