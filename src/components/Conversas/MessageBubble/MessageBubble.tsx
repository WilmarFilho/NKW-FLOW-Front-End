import React from 'react';
import './messageBubble.css';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  text: string;
  sender: 'me' | 'other';
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, sender }) => {
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

export default MessageBubble;
