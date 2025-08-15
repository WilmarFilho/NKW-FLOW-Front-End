// Libs
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
// Hooks
import { useAudioRecorder } from '../../../hooks/chats/useAudioRecorder';
// Css
import styles from './ChatInput.module.css';
// Icons
import Icon from '../Icons/Icons';

type ChatInputProps = {
  placeholder?: string;
  onSend: (message: string, mimetype?: string, base64?: string) => void;
};

export default function ChatInput({ placeholder = 'Digite sua mensagem...', onSend }: ChatInputProps) {
  const [input, setInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleRecordingComplete = (base64: string, mimetype: string) => {
    onSend('', mimetype, base64);
  };

  const { isRecording, startRecording, sendRecording, cancelRecording, initVisualizer } = useAudioRecorder(handleRecordingComplete);

  // Inicia o visualizador quando a gravação começa
  useEffect(() => {
    if (isRecording && canvasRef.current) {
      initVisualizer(canvasRef.current);
    }
  }, [isRecording, initVisualizer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      const messageText = file.type.startsWith('image/') ? '' : file.name;
      onSend(messageText, file.type, base64);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // UI de Gravação
  if (isRecording) {
    return (
      <div className={styles.recordingContainer}>
        <button
          type="button"
          className={`${styles.sendButton} ${styles.trashButton}`}
          aria-label="Cancelar gravação"
          onClick={cancelRecording}
        >
          <Icon nome='trash' />
        </button>
        {/* 👇 MELHORIA: Contêiner para a label e o canvas */}
        <div className={styles.visualizerContainer}>
          <span className={styles.recordingLabel}>Gravando...</span>
          <canvas ref={canvasRef} className={styles.visualizer} height="40"></canvas>
        </div>
        <button
          type="button"
          className={`${styles.sendButton} ${styles.sendRecordingButton}`}
          aria-label="Enviar gravação"
          onClick={sendRecording}
        >
          <Icon nome='send' />
        </button>
      </div>
    );
  }

  // UI Padrão (Formulário)
  return (
    <motion.form className={styles.chatInputForm} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.inputField}
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <input
        type="file"
        accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.zip,.ppt,.pptx,audio/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <button
        type="button"
        className={styles.sendButton}
        aria-label="Anexar arquivo"
        onClick={() => fileInputRef.current?.click()}
      >
        <Icon nome='upload' />
      </button>

      {/* Lógica condicional para os botões da direita */}
      {input.trim() ? (
        // Se estiver digitando, mostra apenas o botão de enviar texto
        <button type="submit" className={styles.sendButton} aria-label="Enviar mensagem">
          <Icon nome='send' />
        </button>
      ) : (
        // Se o input estiver vazio, mostra os botões de upload e de gravar
        <>

          <button type="button" className={styles.sendButton} aria-label="Gravar áudio" onClick={startRecording}>
            <Icon nome='mic' />
          </button>
        </>
      )}
    </motion.form>
  );
}