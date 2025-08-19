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
    const body: Partial<Chat> = { ia_ativa: !currentStatus };

    // desligando → grava timestamp; ligando → zera timestamp
    if (currentStatus === true) {
      body.ia_desligada_em = new Date().toISOString();
    } else {
      body.ia_desligada_em = null;
    }

    const updated = await put<Chat>(`/chats/${chatId}`, body);
    if (updated) {
      setChats(prev =>
        prev.map(c =>
          c.id === chatId
            ? { ...c, ia_ativa: updated.ia_ativa, ia_desligada_em: updated.ia_desligada_em }
            : c
        )
      );
  
      return updated; // << retorna o chat inteiro
    }
    return null;
  }, [put, setChats]);

  const claimChatOwner = async (chatId: string, userId: string) => {
    const result = await put(`/chats/${chatId}`, { user_id: userId });
    if (result) {
      setChats((prev) =>
        prev.map((chat) => (chat.id === chatId ? { ...chat, user_id: userId } : chat))
      );
    }
    return result;
  };

  return { deleteChat, renameChat, reOpenChat, toggleIA, claimChatOwner };
}

