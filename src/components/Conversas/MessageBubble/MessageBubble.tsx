//Css
import './messageBubble.css';
//Libbs
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  text: string;
  sender: 'me' | 'other';
}

export default function MessageBubble({ text, sender } : MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
      className={`bubble ${sender}`}
    >
      <p>{text}</p>
    </motion.div>
  );
};


