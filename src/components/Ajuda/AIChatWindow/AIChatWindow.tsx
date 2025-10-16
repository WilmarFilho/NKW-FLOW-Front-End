import ReactMarkdown from 'react-markdown';
import AiChatWindow from './AIChatWindow.module.css';
import { MessagesHelpChat } from '../../../types/helpChat';

interface AIChatWindowProps {
  messages: MessagesHelpChat[] | null;
  isSubmitting?: boolean;
}

export default function AIChatWindow({ messages, isSubmitting }: AIChatWindowProps) {
  return (
    <div className={AiChatWindow.aiChatWindow}>
      {messages && messages.map((msg, idx) => (
        <div
          key={idx}
          className={`${AiChatWindow.aiChatMessage} ${msg.from === 'user' ? AiChatWindow.user : AiChatWindow.bot
            }`}
        >

          <ReactMarkdown>{msg.content}</ReactMarkdown>
        </div>
      ))}
      {isSubmitting && (
        <div className={`${AiChatWindow.aiChatMessage} ${AiChatWindow.bot}`}>
          <em>Digitando...</em>
        </div>
      )}
    </div>
  );
}