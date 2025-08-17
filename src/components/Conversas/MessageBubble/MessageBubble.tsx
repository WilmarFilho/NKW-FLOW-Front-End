// Libs
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
// CSS Modules
import styles from './MessageBubble.module.css';
import Icon from '../../../components/Gerais/Icons/Icons';
import { DropdownMenu } from '../../../components/Gerais/Dropdown/DropdownMenu';
import { useDropdownMenu } from '../../../components/Gerais/Dropdown/DropdownMenuContext';

interface MessageBubbleProps {
  id: string;
  text?: string | null;
  senderName: string;
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
  const { id, sender, mimetype, onReply, quote, senderName } = props;

  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<'top' | 'bottom'>('bottom');

  const bubbleRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { openMenuId } = useDropdownMenu();

  const menuHeightRef = useRef<number>(0);

  const computePosition = () => {
    if (!bubbleRef.current) return;

    const bubbleRect = bubbleRef.current.getBoundingClientRect();
    const maybeEl = bubbleRef.current.closest('[data-scroll="messages"]');
    const scroller: HTMLElement | Window =
      maybeEl instanceof HTMLElement ? maybeEl : window;

    const scrollerRect =
      scroller instanceof Window
        ? ({ top: 0, bottom: window.innerHeight } as DOMRect)
        : scroller.getBoundingClientRect();

    // só mede uma vez
    if (menuRef.current && !menuHeightRef.current) {
      menuHeightRef.current = menuRef.current.offsetHeight;
    }

    const estimatedMenuHeight = menuHeightRef.current || 200;

    const spaceBelow = scrollerRect.bottom - bubbleRect.bottom;
    const spaceAbove = bubbleRect.top - scrollerRect.top;

    const shouldUseTop = spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow;

    setMenuPosition(shouldUseTop ? 'top' : 'bottom');
  };


  // listeners só enquanto este menu está aberto (evita loops)
  useEffect(() => {
    const isOpenHere = openMenuId === `message-${id}`;
    if (!isOpenHere) return;

    // Mede após montar (e novamente no próximo frame para pegar animações)
    const tick = () => {
      computePosition();
      requestAnimationFrame(computePosition);
    };
    const t = setTimeout(tick, 0);

    const maybeEl = bubbleRef.current?.closest('[data-scroll="messages"]');
    const scroller: HTMLElement | Window =
      maybeEl instanceof HTMLElement ? maybeEl : window;

    const onScrollOrResize = () => requestAnimationFrame(computePosition);

    window.addEventListener('resize', onScrollOrResize);
    if (scroller instanceof Window) {
      scroller.addEventListener('scroll', onScrollOrResize, { passive: true });
    } else {
      scroller.addEventListener('scroll', onScrollOrResize, { passive: true });
    }

    const ro = new ResizeObserver(() => requestAnimationFrame(computePosition));
    if (menuRef.current) ro.observe(menuRef.current);

    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', onScrollOrResize);
      if (scroller instanceof Window) {
        scroller.removeEventListener('scroll', onScrollOrResize);
      } else {
        scroller.removeEventListener('scroll', onScrollOrResize);
      }
      ro.disconnect();
    };
  }, [openMenuId, id]);

  // sincroniza visual (hover/mostrar trigger) com estado global
  useEffect(() => {
    const isOpenHere = openMenuId === `message-${id}`;
    setShowMenu(isOpenHere);
    if (!isOpenHere) setIsHovered(false);
  }, [openMenuId, id]);

  const handleTriggerClick = () => {
    setIsHovered(true);
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
        if (!showMenu) setIsHovered(false);
      }}
    >
      {quote && (
        <div className={styles.quotedMessage}>
          <span className={styles.quotedSender}>
            {quote.remetente === 'cliente' ? 'Você' : senderName}
          </span>
          <p className={styles.quotedText}>
            {quote.mensagem ||
              (quote.mimetype?.startsWith('image/') ? '📷 Imagem' : 'Mensagem')}
          </p>
        </div>
      )}

      {renderMessageContent(props)}

      {(isHovered || showMenu) && (
        <DropdownMenu
          menuRef={menuRef}
          id={`message-${id}`}
          variant="message"
          position={menuPosition}
          direction={sender === 'me' ? 'right' : 'left'}
          trigger={
            <button className={styles.actionButton} onClick={handleTriggerClick}>
              <Icon nome="arrowdown" />
            </button>
          }
          className={`${styles.messageMenu} ${sender === 'me' ? styles.menuRight : styles.menuLeft
            }`}
        >
          <button
            onClick={() => {
              onReply?.();
            }}
          >
            <Icon nome="arrow" /> Responder Mensagem
          </button>

          {props.text && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(props.text || '');
              }}
            >
              <Icon nome="copy" /> Copiar mensagem
            </button>
          )}
        </DropdownMenu>
      )}
    </motion.div>
  );
}