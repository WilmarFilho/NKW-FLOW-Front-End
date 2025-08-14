// Libs
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
// Css
import AiChatWindow from './AIChatWindow.module.css';
// Type
import { HelpChat } from '../../../types/helpChat';

interface AIChatWindowProps {
  messages: HelpChat[];
}

export default function AIChatWindow({ messages }: AIChatWindowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
      className={AiChatWindow.aiChatWindow}
    >
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`${AiChatWindow.aiChatMessage} ${
            msg.from === 'user' ? AiChatWindow.user : AiChatWindow.bot
          }`}
        >
          <ReactMarkdown>{msg.content.text}</ReactMarkdown>
        </div>
      ))}
    </motion.div>
  );
}