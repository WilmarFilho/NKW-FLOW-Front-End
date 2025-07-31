// Libbs
import { useCallback } from 'react';
// Utils
import { useApi } from '../utils/useApi'; 
// Types
import type { Chat } from '../../types/chats';

// Supabase geralmente retorna um array com o item atualizado.
type ToggleIAResponse = Chat[];

const useToggleIA = () => {

  const { put } = useApi<ToggleIAResponse>();

  const toggleIA = useCallback(async (chat: Chat, onSuccess: (updatedChat: Chat) => void) => {
    const payload = {
      ...chat,
      ia_ativa: !chat.ia_ativa,
    };

    const responseData = await put(`/chats/${chat.id}`, payload);

    if (responseData && responseData.length > 0) {
      onSuccess(responseData[0]); 
    }

  }, [put]);
 

  return { toggleIA };
};

export default useToggleIA;
