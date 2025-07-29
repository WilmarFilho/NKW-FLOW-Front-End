//  Libs
import { useEffect, useMemo } from 'react';
import { useRecoilState } from 'recoil';
// Atom
import { messagesState } from '../../state/atom';
// Utils
import { useApi } from '../useApi'; 
// Types
import type { Message } from '../../types/message';

export default function useMessages(chatId: string | null) {
 
  const [allMessages, setMessages] = useRecoilState(messagesState);
  
  const { get } = useApi<Message[]>();

  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      const data = await get(`/messages/chat/${chatId}`);
      
      if (data) {
        setMessages(prevMessages => {
          const existingIds = new Set(prevMessages.map(p => p.id));
          const newMessages = data.filter(m => !existingIds.has(m.id));
          return [...prevMessages, ...newMessages];
        });
      }
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
