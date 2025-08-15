// Libs
import { useCallback } from 'react';
// Recoil
import { useSetRecoilState } from 'recoil';
import { chatsState } from '../../state/atom';
// Hooks
import { useApi } from '../utils/useApi';
// Types
import type { Chat } from '../../types/chats';

export default function useChatActions() {

  // Carrega metodo para modificar chats
  const setChats = useSetRecoilState(chatsState);

  // Carrega Metodos do hook da api
  const { del, put } = useApi();

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

  const toggleIA = useCallback(async (chatId: string, currentStatus: boolean) => {

    const result = await put<Chat>(`/chats/${chatId}`, {
      ia_ativa: !currentStatus,
    });

    if (result) {
      return result.ia_ativa;
    }

  }, [put]);

  return { deleteChat, renameChat, reOpenChat, toggleIA };
}