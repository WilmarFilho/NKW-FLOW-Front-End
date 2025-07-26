import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { chatsState } from '../state/atom';
import { Chat } from '../types/chats';
import { apiConfig } from '../config/api';

export default function useChats(userId: string) {
  const [chats, setChats] = useRecoilState(chatsState);

  useEffect(() => {
    if (!userId) return;

    const fetchChats = async () => {
      try {
        const res = await fetch(`${apiConfig.node}/chats`);
        if (!res.ok) throw new Error('Erro ao buscar chats');
        const data: Chat[] = await res.json();
        setChats(data); // Salva no Recoil
      } catch (err) {
        console.error('Erro ao carregar chats:', err);
        setChats([]);
      }
    };

    fetchChats();
  }, [userId, setChats]);

  return { chats };
}
