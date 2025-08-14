import { useRecoilValue } from 'recoil';
// Hooks
import { useSendHelpMessage } from '../hooks/help/useSendHelpMessage';
// Components
import ChatInput from '../components/Gerais/Inputs/ChatInput';
import HelpHeader from '../components/Ajuda/HelpHeader/HelpHeader';
import AIChatWindow from '../components/Ajuda/AIChatWindow/AIChatWindow';
// Atom
import { helpChatState } from '../state/atom';
// Css
import GlobalStyles from '../global.module.css';

export default function AjudaPage() {
  const messages = useRecoilValue(helpChatState);
  const { sendMessage } = useSendHelpMessage();

  return (
    <div className={GlobalStyles.pageContainer}>
      <HelpHeader />
      <AIChatWindow messages={messages} />
      <ChatInput placeholder="Pergunte qualquer coisa" onSend={sendMessage} />
    </div>
  );
}