import './ajudaPage.css';
import ChatInput from '../../components/Gerais/Inputs/ChatInput';
import { useRecoilValue } from 'recoil';
import { helpChatState } from '../../state/atom';
import { useSendHelpMessage } from '../../hooks/useSendHelpMessage';
import ReactMarkdown from 'react-markdown';

export default function AjudaPage() {
  const messages = useRecoilValue(helpChatState);
  const { sendMessage } = useSendHelpMessage();

  return (
    <div className="help-container">

      <div className="ajuda-header">
        <div>
          <h2>Página de Ajuda</h2>
          <h3>Pergunte qualquer coisa que estiver com dúvidas sobre o NKW FLOW.</h3>
        </div>

      </div>

      <div className="help-chat">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`help-message ${msg.from === 'user' ? 'user' : 'bot'}`}
          >
            <ReactMarkdown>
              {msg.content.text}
            </ReactMarkdown>

          </div>
        ))}
      </div>

      <ChatInput placeholder="Pergunte qualquer coisa" onSend={sendMessage} />

    </div>
  );
}
