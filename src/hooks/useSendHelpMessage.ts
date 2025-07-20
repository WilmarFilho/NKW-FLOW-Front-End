import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { helpChatState } from '../state/atom';
import type { HelpChat } from '../types/helpChat';
import axios from 'axios';
import { apiConfig } from '../config/api';

export function useSendHelpMessage() {
  const [error, setError] = useState<string | null>(null);
  const setMessages = useSetRecoilState(helpChatState);

  const sendMessage = async (text: string) => {
    const userMessage: HelpChat = {
      from: 'user',
      content: { text },
    };

    setMessages(prev => [...prev, userMessage]);
    setError(null);

    try {
      const { data } = await axios.post(`${apiConfig.node}/api/help/chat`, {
        message: text,
      });

      const systemMessage: HelpChat = {
        from: 'system',
        content: { text: data.reply },
      };

      setMessages(prev => [...prev, systemMessage]);
    } catch (err) {
      setError('Erro ao enviar mensagem.' + err);
    } 
  };

  return { sendMessage, error };
}
