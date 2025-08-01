// Libbs
import { useCallback } from 'react';
import { toast } from 'react-toastify';
// Utils
import { useApi } from '../utils/useApi'; 
// Types
import type { Chat } from '../../types/chats';

const useToggleIA = () => {

  const { put } = useApi<Chat>();

  const toggleIA = useCallback(async (chat: Chat, onSuccess: (updatedChat: Chat) => void) => {
    const payload = {
      ...chat,
      ia_ativa: !chat.ia_ativa,
    };

    const responseData = await put(`/chats/${chat.id}`, payload);

    if (responseData) {
      onSuccess(responseData); 
      toast.success('Alteração salva!');
    } else {
      toast.error('Erro ao salvar. Tente novamente.');
    }

  }, [put]);
 

  return { toggleIA };
};

export default useToggleIA;





