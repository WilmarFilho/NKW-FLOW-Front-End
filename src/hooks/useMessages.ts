import { useEffect, useState } from 'react';
import { Message } from '../types/message';
import { apiConfig } from '../config/api';

export default function useMessages(chatId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiConfig.node}/messages/`);
        if (!res.ok) throw new Error('Erro ao buscar mensagens');
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId]);

  return { messages, loading };
}
