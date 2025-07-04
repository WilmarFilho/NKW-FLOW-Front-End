import './ajudaPage.css';
import ChatInput from '../../components/Gerais/Inputs/ChatInput';
import { useRecoilValue } from "recoil";
import { helpChatState } from '../../state/atom';
import { useSendHelpMessage } from '../../hooks/useSendHelpMessage';

export default function AjudaPage() {
  const messages = useRecoilValue(helpChatState);
  const { sendMessage } = useSendHelpMessage();

  return (
    <div className="help-wrapper">
      <div className="help-chat">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`help-message ${msg.from === 'user' ? 'user' : 'bot'}`}
          >
            {msg.content.text}
          </div>
        ))}
      </div>

      <ChatInput placeholder="Pergunte qualquer coisa" onSend={sendMessage} />
      
    </div>
  );
}
