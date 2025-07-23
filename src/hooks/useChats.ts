import { useEffect, useState } from 'react';
import { Chat } from '../types/chats';
import { apiConfig } from '../config/api';

export default function useChats(userId: string) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchChats = async () => {
      try {
        const res = await fetch(`${apiConfig.node}/chats`);
        if (!res.ok) throw new Error('Erro ao buscar chats');
        const data = await res.json();
        setChats(data);
      } catch (err) {
        console.error(err);
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [userId]);

  return { chats, loading };
}
