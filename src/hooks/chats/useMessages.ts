// Libs
import { useEffect, useMemo } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
// Recoil
import { messagesState, chatsState } from '../../state/atom';
// Hooks
import { useApi } from '../utils/useApi';
// Types
import type { Message } from '../../types/message';

export const useMessages = (chatId: string | null) => {
  // Carrega atom das messages
  const [allMessages, setMessages] = useRecoilState(messagesState);
  const setChats = useSetRecoilState(chatsState);

  // Carrega Metodos do hook da api
  const { get, post } = useApi();

  useEffect(() => {
    if (!chatId) return;

    const fetchMessagesAndMarkRead = async () => {
      // 1. Buscar mensagens
      const data = await get<Message[]>(`/messages/chat/${chatId}`);
      if (data) setMessages(data);

      // 2. Marcar como lido no back
      await post(`/chats/${chatId}/read`);

      // 3. Atualizar localmente o unread_count = 0
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId ? { ...c, unread_count: 0 } : c
        )
      );
    };

    fetchMessagesAndMarkRead();
  }, [chatId, get, post, setMessages, setChats]);

  const filteredMessages = useMemo(() => {
    return allMessages.filter((msg) => msg.chat_id === chatId);
  }, [allMessages, chatId]);

  return { messages: filteredMessages };
};
