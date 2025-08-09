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

export default function useSendMessage() {
  const { post } = useApi();

  const sendMessage = async (payload: SendMessagePayload) => {
     console.log(payload)
    const apiPayload = {
      ...payload,
      remetente: 'cliente',
    };

    const result = await post('/messages/', apiPayload);

    return result;
  };

  return { sendMessage };
}