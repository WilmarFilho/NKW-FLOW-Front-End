// Recoil
import { useRecoilValue } from 'recoil';
import { helpChatState } from '../../state/atom';
// Hooks
import { useHelpActions } from '../help/useHelpActions';

export function useAjudaPage() {

  // Carrega mensagens do chat de ajuda
  const messages = useRecoilValue(helpChatState);

  const { sendMessage } = useHelpActions();

  return {
    messages,
    sendMessage,
  };
}