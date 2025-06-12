import { useState } from 'react';
import './ajudaPage.css';
import ChatInput from '../../components/Gerais/Inputs/ChatInput';

type Message = {
  from: 'user' | 'bot';
  text: string;
};

export default function AjudaPage() {
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: 'Olá! Como posso te ajudar hoje?' },
  ]);

  const handleUserSend = (msg: string) => {
    const userMessage: Message = { from: 'user', text: msg };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: 'Estou analisando sua dúvida...' },
      ]);
    }, 800);
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

      <ChatInput placeholder="Pergunte qualquer coisa" onSend={handleUserSend} />
      
    </div>
  );
}
