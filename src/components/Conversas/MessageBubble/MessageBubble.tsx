// Libs
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// CSS Modules
import styles from './MessageBubble.module.css';
import Icon from '../../../components/Gerais/Icons/Icons';

interface MessageBubbleProps {
  text?: string | null;
  sender: 'me' | 'other';
  mimetype?: string;
  base64?: string;
  quote?: { mensagem?: string | null; mimetype?: string; remetente: 'cliente' | 'humano' };
  onReply?: () => void;
}

const renderMessageContent = ({ mimetype, base64, text }: MessageBubbleProps) => {
  const type = mimetype || 'text';

  if (type === 'image/png' && base64) {
    return (
      <>
        <img
          src={`data:image/jpeg;base64,${base64}`}
          alt="Imagem enviada na conversa"
          className={styles.messageImage}
          loading="lazy"
        />
        {text && <p>{text}</p>}
      </>
    );
  }

  if (type === 'image/webp' && base64) {
    return (
      <img
        src={`data:image/webp;base64,${base64}`}
        alt="Figurinha (sticker)"
        className={styles.stickerImage}
        loading="lazy"
      />
    );
  }

  if (type.startsWith('audio') && base64) {
    return (
      <audio controls className={styles.messageAudio}>
        <source src={`data:audio/ogg;base64,${base64}`} type="audio/ogg" />
        Seu navegador não suporta o elemento de áudio.
      </audio>
    );
  }

  if (type !== 'text' && base64) {
    return (
      <div className={styles.documentContainer}>
        <span className={styles.documentIcon}>📄</span>
        <a
          href={`data:${mimetype};base64,${base64}`}
          download={text || 'arquivo'}
          className={styles.documentLink}
        >
          {text || 'Baixar Documento'}
        </a>
      </div>
    );
  }

  if (!text) return null;

  const rawLines = text.split('\n');
  const lines = rawLines.map((l) => l.trim()).filter((l) => l !== '');

  return (
    <p className={styles.messageText}>
      {lines.map((line, idx) => {
        const isFirstLine = idx === 0;
        const matchBold = line.match(/^\*(.*?)\*$/);

        if (isFirstLine && matchBold) {
          return (
            <span key={idx}>
              <strong>{matchBold[1]}</strong>
              <br />
            </span>
          );
        }

        return (
          <span key={idx}>
            {line}
            <br />
          </span>
        );
      })}
    </p>
  );
};

export default function MessageBubble(props: MessageBubbleProps) {
  const { sender, mimetype, onReply, quote } = props;

  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const bubbleClasses = [
    styles.messageBubble,
    sender === 'me' ? styles.isMe : styles.isOther,
    mimetype === 'sticker' ? styles.stickerBubble : '',
  ].join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3, ease: 'easeOut' }}
      className={bubbleClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
    >
      {quote && (
        <div className={styles.quotedMessage}>
          <span className={styles.quotedSender}>
            {quote.remetente === 'cliente' ? 'Você' : 'Contato'}
          </span>
          <p className={styles.quotedText}>
            {quote.mensagem ||
              (quote.mimetype?.startsWith('image/')
                ? '📷 Imagem'
                : 'Mensagem')}
          </p>
        </div>
      )}

      {/* Conteúdo da mensagem */}
      {renderMessageContent(props)}

      {/* Ícone de ações (aparece só no hover) */}
      {isHovered && (
        <div className={styles.messageActions}>
          <button
            className={styles.actionButton}
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <Icon nome='arrowdown'/>
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.ul
                className={styles.messageMenu}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
              >
                <li>
                  <button
                    onClick={() => {
                      onReply?.();
                      setShowMenu(false);
                    }}
                  >
                    Responder mensagem
                  </button>
                </li>
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
