import { useRecoilValue, useSetRecoilState } from 'recoil';
import { activeChatState, helpChatState } from '../../state/atom';
import { useHelpActions } from '../help/useHelpActions';
import { useEffect } from 'react';

export function useAjudaPage() {

  const setActiveChat = useSetRecoilState(activeChatState);

  // resetar o chat ativo ao entrar na página
  useEffect(() => {
    setActiveChat(null);
  }, []);

  const messages = useRecoilValue(helpChatState);

  const { sendMessage } = useHelpActions();

  return {
    messages,
    sendMessage,
  };
}