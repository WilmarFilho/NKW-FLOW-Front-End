import { useState } from 'react';
import { motion } from 'framer-motion';

// Estilos
import styles from './ChatInput.module.css';

type ChatInputProps = {
  placeholder?: string;
  onSend: (message: string) => void;
};

export default function ChatInput({ placeholder = 'Digite sua mensagem...', onSend }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput('');
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
      className={styles.chatInputForm}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className={styles.inputField}
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button type="submit" className={styles.sendButton} aria-label="Enviar mensagem">
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 2L11 13" />
          <path d="M22 2L15 22L11 13L2 9L22 2Z" />
        </svg>
      </button>
    </motion.form>
  );
}