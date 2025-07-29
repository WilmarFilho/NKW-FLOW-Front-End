import { useState } from 'react';
import { apiConfig } from '../config/api';

interface SendMessagePayload {
  chat_id: string;
  mensagem: string;
  remetente?: 'humano';
  mimetype?: string;
  base64?: string;
  transcricao?: string;
}

export default function useSendMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (payload: SendMessagePayload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiConfig.node}/messages/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          remetente: 'cliente',
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }

      return await response.json();
    } catch (err) {
      setError('Erro desconhecido');
      console.error('Erro ao enviar mensagem:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error };
}
