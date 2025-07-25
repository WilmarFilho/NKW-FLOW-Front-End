import { useCallback } from 'react';
import axios from 'axios';
import { Chat } from '../types/chats';
import { apiConfig } from '../config/api';

const useToggleIA = () => {
  const toggleIA = useCallback(async (chat: Chat, onSuccess: (updated: Chat) => void) => {
    try {
      const response = await axios.put(`${apiConfig.node}/chats/${chat.id}`, {
        ...chat,
        ia_ativa: !chat.ia_ativa,
      });
      onSuccess(response.data[0]); // Supabase retorna array
    } catch (err) {
      console.error('Erro ao alternar IA:', err);
    }
  }, []);

  return { toggleIA };
};

export default useToggleIA;
