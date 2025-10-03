import ReactMarkdown from 'react-markdown';
import AiChatWindow from './AIChatWindow.module.css';
import { HelpChat } from '../../../types/helpChat';

interface AIChatWindowProps {
  messages: HelpChat[] | null;
}

export default function AIChatWindow({ messages }: AIChatWindowProps) {
  return (
    <div className={AiChatWindow.aiChatWindow} >
      {messages && messages.map((msg, idx) => (
        <div
          key={idx}
          className={`${AiChatWindow.aiChatMessage} ${
            msg.from === 'user' ? AiChatWindow.user : AiChatWindow.bot
          }`}
        >
          <ReactMarkdown>{msg.content.text}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
}