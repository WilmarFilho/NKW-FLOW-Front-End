import { useAjudaPage } from '..//hooks/pages/useAjudaPage';
import HelpHeader from '../components/Ajuda/HelpHeader/HelpHeader';
import AIChatWindow from '../components/Ajuda/AIChatWindow/AIChatWindow';
import GlobalStyles from '../global.module.css';

export default function AjudaPage() {
  const { messages, sendMessage } = useAjudaPage();

  return (
    <div className={GlobalStyles.pageContainer}>
      <HelpHeader />
      <AIChatWindow messages={messages} />
      <input placeholder="Pergunte qualquer coisa" className={GlobalStyles.InputForm} onKeyDown={(e) => {
        if (e.key === 'Enter') {
          sendMessage(e.currentTarget.value);
          e.currentTarget.value = '';
        }
      }} />
    </div>
  );
}