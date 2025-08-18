// Libs
import { useEffect, useMemo } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
// Recoil
import { messagesState, chatsState } from '../../state/atom';
// Hooks
import { useApi } from '../utils/useApi';
// Types
import type { Message } from '../../types/message';

export const useMessages = (chatId: string | null) => {
  // Carrega atom das messages
  const [allMessages, setMessages] = useRecoilState(messagesState);
  const chats = useRecoilValue(chatsState);
  const setChats = useSetRecoilState(chatsState);

  // Carrega métodos do hook da api
  const { get, post } = useApi();

  useEffect(() => {
    if (!chatId) return;

    const fetchMessagesAndMarkRead = async () => {
      // 1. Buscar mensagens
      const data = await get<Message[]>(`/messages/chat/${chatId}`);
      if (data) setMessages(data);

      // 2. Verifica o unread_count antes de marcar como lido
      const chat = chats.find((c) => c.id === chatId);
      
      if (chat && chat.unread_count > 0) {
        await post(`/chats_reads/${chatId}`);

        // 3. Atualizar localmente o unread_count = 0
        setChats((prev) =>
          prev.map((c) =>
            c.id === chatId ? { ...c, unread_count: 0 } : c
          )
        );
      }
    };

    fetchMessagesAndMarkRead();
  }, [chatId, get, post, setMessages, setChats, chats]);

  const filteredMessages = useMemo(() => {
    return allMessages.filter((msg) => msg.chat_id === chatId);
  }, [allMessages, chatId]);

  return { messages: filteredMessages };
};