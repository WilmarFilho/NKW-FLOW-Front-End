//  Libs
import { useEffect, useMemo } from 'react';
import { useRecoilState } from 'recoil';
// Atom
import { messagesState } from '../../state/atom';
// Utils
import { useApi } from '../utils/useApi';
// Types
import type { Message } from '../../types/message';

export default function useMessages(chatId: string | null) {

  const [allMessages, setMessages] = useRecoilState(messagesState);

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

  return {
    messages: filteredMessages
  };
}