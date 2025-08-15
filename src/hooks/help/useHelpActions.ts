// Libs
import { useRecoilState, useSetRecoilState } from 'recoil';
// Recoil
import { helpChatState, userState } from '../../state/atom';
// Hooks
import { useApi } from '../utils/useApi';
// Types
import type { HelpChat, HelpChatResponse } from '../../types/helpChat';

export function useHelpActions() {

  // Carrega o estado do chat de ajuda
  const setMessages = useSetRecoilState(helpChatState);

  // Carrega o usuário
  const [user] = useRecoilState(userState);

  // Carrega Metodos do hook da api
  const { post } = useApi();

  const sendMessage = async (text: string) => {

    if(!user) return;

    const userMessage: HelpChat = {
      from: 'user',
      content: { text },
    };
    
    setMessages(prev => [...prev, userMessage]);

    const data = await post<HelpChatResponse>('/api/help/chat', { message: text });

    if (data && data.reply) {
      const systemMessage: HelpChat = {
        from: 'system',
        content: { text: data.reply },
      };
      setMessages(prev => [...prev, systemMessage]);
    }
  };

  return { sendMessage };
}