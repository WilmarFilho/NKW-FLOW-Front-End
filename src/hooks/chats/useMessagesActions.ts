// Hooks
import { useApi } from '../utils/useApi';
// Types
import { SendMessagePayload } from '../../types/message';

export default function useMessagesActions() {

  // Carrega Metodos do hook da api
  const { post, del } = useApi();

  const sendMessage = async (payload: SendMessagePayload) => {

    const result = await post('/messages/', {
      ...payload,
    });

    return result;

  };

  const deleteMessage = async (id: string) => {
    try {
      const result = await del(`/messages/${id}`);
      return result;
    } catch (err) {
      console.error('Erro ao deletar mensagem', err);
      return null;
    }
  };

  return { sendMessage, deleteMessage };
}





