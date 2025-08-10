// Libs
import { useCallback } from 'react';
// Recoil
import { useSetRecoilState } from 'recoil';
import { chatsState } from '../../state/atom';
// Hooks
import { useApi } from '../utils/useApi';
// Types
import type { Chat } from '../../types/chats';
import { toast } from 'react-toastify';

export default function useChatActions() {
  const setChats = useSetRecoilState(chatsState);
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
    const payload = {
      ia_ativa: !currentStatus,
    };
    const responseData = await put<Chat>(`/chats/${chatId}`, payload);
    if (responseData) {
      toast.success('Alteração salva!');
      return responseData.ia_ativa;
    } else {
      toast.error('Erro ao salvar. Tente novamente.');
      return null;
    }
  }, [put]);

  return { deleteChat, renameChat, reOpenChat, toggleIA };
}