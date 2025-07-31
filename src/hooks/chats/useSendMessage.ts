// Utils
import { useApi } from '../utils/useApi'; 
// Types
import type { Message } from '../../types/message';

interface SendMessagePayload {
  chat_id: string;
  mensagem: string;
  remetente?: 'humano';
  mimetype?: string;
  base64?: string;
  transcricao?: string;
}

export default function useSendMessage() {
  
  const { post } = useApi<Message>();

  const sendMessage = async (payload: SendMessagePayload) => {
    const apiPayload = {
      ...payload,
      remetente: 'cliente', 
    };

    const result = await post('/messages/', apiPayload);

    return result;
  };

  return { sendMessage };
}