// Libs
import { useEffect, useMemo } from 'react';
import { useRecoilState } from 'recoil';
// Recoil
import { messagesState } from '../../state/atom';
// Hooks
import { useApi } from '../utils/useApi';
// Types
import type { Message } from '../../types/message';

export const useMessages = (chatId: string | null) => {

  // Carrega atom das messages
  const [allMessages, setMessages] = useRecoilState(messagesState);

  // Carrega Metodos do hook da api
  const { get } = useApi();

  useEffect(() => {

    if (!chatId) return;

    const fetchMessages = async () => {
      const data = await get<Message[]>(`/messages/chat/${chatId}`);
      if (!data) return;
      setMessages(data);
    };

    fetchMessages();

  }, [chatId, get, setMessages]);

  const filteredMessages = useMemo(() => {
    return allMessages.filter(msg => msg.chat_id === chatId);
  }, [allMessages, chatId]);

  return { messages: filteredMessages };
}