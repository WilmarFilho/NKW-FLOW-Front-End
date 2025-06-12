import './ajudaPage.css';
import { useState } from 'react';

type Message = {
  from: 'user' | 'bot';
  text: string;
};

export default function AjudaPage() {
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: 'Olá! Como posso te ajudar hoje?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { from: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);

    // Simulação de resposta da IA
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: 'Estou analisando sua dúvida...' },
      ]);
    }, 800);

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="help-wrapper">
      <div className="help-chat">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`help-message ${msg.from === 'user' ? 'user' : 'bot'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="help-input-wrapper">
        <input
          type="text"
          placeholder="Pergunte qualquer coisa"
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
    </div>
  );
}
