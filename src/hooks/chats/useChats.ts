// Libs
import { useCallback } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
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
  const setChats = useSetRecoilState(chatsState);

  // Carrega Metodos do hook da api
  const { get, put } = useApi();

  const fetchChats = useCallback(async (userParam?: User) => {

    const currentUser = userParam ?? user;
    if (!currentUser) return;

    const fetchedData = await get<Chat[]>('/chats', {
          params: { user_id: currentUser.id }
        });

    if (fetchedData) {
      setChats(fetchedData);
      return fetchedData; 
    }
    
  }, [get, setChats]);

  const fectchImageProfile = async (chatId: string) => {
    const updatedChat = await put<Chat>(`/chats/fetchImage/${chatId}`);
    return updatedChat;
  };

  return { fetchChats, fectchImageProfile };
}