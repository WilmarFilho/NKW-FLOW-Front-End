import { useRecoilValue } from 'recoil';
import { helpChatState } from '../../state/atom';
import { useHelpActions } from '../help/useHelpActions';

export function useAjudaPage() {
  const messages = useRecoilValue(helpChatState);
  const { sendMessage } = useHelpActions();

  return {
    messages,
    sendMessage,
  };
}