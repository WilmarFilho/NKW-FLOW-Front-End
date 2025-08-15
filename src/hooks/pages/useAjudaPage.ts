import { useRecoilValue } from 'recoil';
import { helpChatState } from '../../state/atom';
import { useSendHelpMessage } from '../help/useSendHelpMessage';

export function useAjudaPage() {
  const messages = useRecoilValue(helpChatState);
  const { sendMessage } = useSendHelpMessage();

  return {
    messages,
    sendMessage,
  };
}