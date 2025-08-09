//  Libs
import { useSetRecoilState } from 'recoil';
// Atom
import { helpChatState } from '../../state/atom';
// Utils
import { useApi } from '../utils/useApi';
// Types
import type { HelpChat } from '../../types/helpChat';

interface HelpChatResponse {
  reply: string;
}

export function useSendHelpMessage() {

  const { post } = useApi();
  const setMessages = useSetRecoilState(helpChatState);

  const sendMessage = async (text: string) => {
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