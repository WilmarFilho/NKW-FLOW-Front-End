import { useAjudaPage } from '..//hooks/pages/useAjudaPage';
import ChatInput from '../components/Gerais/Inputs/ChatInput';
import HelpHeader from '../components/Ajuda/HelpHeader/HelpHeader';
import AIChatWindow from '../components/Ajuda/AIChatWindow/AIChatWindow';
import GlobalStyles from '../global.module.css';

export default function AjudaPage() {
  const { messages, sendMessage } = useAjudaPage();

  return (
    <div className={GlobalStyles.pageContainer}>
      <HelpHeader />
      <AIChatWindow messages={messages} />
      <ChatInput placeholder="Pergunte qualquer coisa" onSend={sendMessage} />
    </div>
  );
}