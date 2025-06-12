import { useState } from 'react';
import './chatInput.css';

type ChatInputProps = {
  placeholder?: string;
  onSend: (message: string) => void ;
};

const ChatInput: React.FC<ChatInputProps> = ({ placeholder = 'Digite sua mensagem...', onSend }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chat-input-wrapper">
      <input
        type="text"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button onClick={handleSend}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#ccc" strokeWidth="2">
          <path d="M22 2L11 13" />
          <path d="M22 2L15 22L11 13L2 9L22 2Z" />
        </svg>
      </button>
    </div>
  );
};

export default ChatInput;
