import React from 'react';
import './messageInput.css';

const MessageInput: React.FC = () => {
  return (
    <div className="message-input">
      <input type="text" placeholder="Digite a sua mensagem" />
      <button className="send-btn">➤</button>
    </div>
  );
};

export default MessageInput;
