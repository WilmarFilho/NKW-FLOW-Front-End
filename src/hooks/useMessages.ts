import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { messagesState } from '../state/atom';
import { Message } from '../types/message';
import { apiConfig } from '../config/api';

export default function useMessages(chatId: string | null) {
  const [messages, setMessages] = useRecoilState(messagesState);

  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`${apiConfig.node}/messages/chat/${chatId}`);
        if (!res.ok) throw new Error('Erro ao buscar mensagens');
        const data: Message[] = await res.json();

        setMessages(prev => {
          const novas = data.filter(m => !prev.some(p => p.id === m.id));
          return [...prev, ...novas];
        });
      } catch (err) {
        console.error('Erro ao carregar mensagens:', err);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [chatId, setMessages]);

  return {
    messages: messages.filter(msg => msg.chat_id === chatId)
  };
}
