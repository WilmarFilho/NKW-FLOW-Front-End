// Libs
import { useEffect, useRef, useState } from 'react';
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
  const [menuPosition, setMenuPosition] = useState<'top' | 'bottom'>('bottom');
  const bubbleRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  // Verificar espaço e definir posição do menu
  useEffect(() => {
    if (showMenu && bubbleRef.current && menuRef.current) {
      const bubbleRect = bubbleRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current.offsetHeight;
      const messageList = bubbleRef.current.closest(`.${styles.messageList}`);

      if (messageList) {
        const listRect = messageList.getBoundingClientRect();

        // Calcula espaço considerando o container scrollável
        const spaceBelow = listRect.bottom - bubbleRect.bottom;
        const spaceAbove = bubbleRect.top - listRect.top;

        // Adiciona uma margem de segurança (20px)
        if (spaceBelow < menuHeight + 20 && spaceAbove > menuHeight + 20) {
          setMenuPosition('top');
        } else {
          setMenuPosition('bottom');
        }
      } else {
        // Fallback para cálculo sem container scrollável
        const spaceBelow = window.innerHeight - bubbleRect.bottom;
        const spaceAbove = bubbleRect.top;

        if (spaceBelow < menuHeight + 20 && spaceAbove > menuHeight + 20) {
          setMenuPosition('top');
        } else {
          setMenuPosition('bottom');
        }
      }
    }
  }, [showMenu]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bubbleRef.current && !bubbleRef.current.contains(event.target as Node)) {
        setShowMenu(false);
        setIsHovered(false); // Adicionado para esconder a seta também
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleButtonClick = () => {
    setShowMenu(prev => !prev); // Alterna o estado do menu
    setIsHovered(true); // Mantém o hover ativo após o clique
  };

  const bubbleClasses = [
    styles.messageBubble,
    sender === 'me' ? styles.isMe : styles.isOther,
    mimetype === 'sticker' ? styles.stickerBubble : '',
  ].join(' ');

  return (
    <motion.div
      ref={bubbleRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3, ease: 'easeOut' }}
      className={bubbleClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        // Só remove o hover se o menu não estiver aberto
        if (!showMenu) {
          setIsHovered(false);
        }
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

      {renderMessageContent(props)}

      {/* Ícone de ações (aparece só no hover ou quando o menu está aberto) */}
      {(isHovered || showMenu) && (
        <div className={styles.messageActions}>
          <button
            ref={buttonRef}
            className={`${styles.actionButton} ${showMenu ? styles.menuOpen : ''}`}
            onClick={handleButtonClick}
            onMouseEnter={() => setIsHovered(true)}
          >
            <Icon nome='arrowdown' />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.ul
                ref={menuRef}
                className={`${styles.messageMenu} ${sender === 'me' ? styles.menuRight : styles.menuLeft
                  } ${menuPosition === 'top' ? styles.menuTop : ''}`}
                initial={{ opacity: 0, y: menuPosition === 'top' ? 5 : -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: menuPosition === 'top' ? 5 : -5 }}
                transition={{ duration: 0.15 }}
                onClick={(e) => e.stopPropagation()}
              >
                <li>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReply?.();
                      setShowMenu(false);
                      setIsHovered(false);
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