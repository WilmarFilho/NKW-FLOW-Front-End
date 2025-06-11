import React from 'react';
import './messageBubble.css';

interface MessageBubbleProps {
  text: string;
  sender: 'me' | 'other';
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, sender }) => {
  return (
    <div className={`bubble ${sender}`}>
      <p>{text}</p>
    </div>
  );
};

export default MessageBubble;
