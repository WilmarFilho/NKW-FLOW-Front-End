// Hooks
import { useApi } from '../utils/useApi';
// Types
import { SendMessagePayload } from '../../types/message';

export default function useMessagesActions() {

  // Carrega Metodos do hook da api
  const { post } = useApi();

  const sendMessage = async (payload: SendMessagePayload) => {

    const result = await post('/messages/', {
      ...payload,
      remetente: 'cliente',
    });

    return result;
    
  };

  return { sendMessage };
}