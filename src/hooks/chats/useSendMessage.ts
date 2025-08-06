// Utils
import { useApi } from '../utils/useApi';
// Types
import type { Message } from '../../types/message';

interface SendMessagePayload {
  chat_id: string;
  user_id?: string;
  mensagem: string;
  mimetype?: string;
  base64?: string;
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








