// Utils
import { useApi } from '../utils/useApi';

interface SendMessagePayload {
  chat_id?: string;
  user_id?: string;
  mensagem: string;
  mimetype?: string;
  base64?: string;
  number?: string;
  connection_id?: string;
}

export default function useMessagesActions() {
  const { post } = useApi();

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