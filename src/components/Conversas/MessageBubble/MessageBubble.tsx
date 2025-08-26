import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './MessageBubble.module.css';
import Icon from '../../../components/Gerais/Icons/Icons';
import { DropdownMenu } from '../../../components/Gerais/Dropdown/DropdownMenu';
import { useDropdownMenu } from '../../../components/Gerais/Dropdown/DropdownMenuContext';
import { CustomAudioPlayer } from './CustomAudioPlayer';

interface MessageBubbleProps {
  id: string;
  text?: string | null;
  senderName: string;
  sender: 'me' | 'other';
  mimetype?: string;
  base64?: string;
  quote?: { mensagem?: string | null; mimetype?: string; remetente: 'Usuário' | 'Contato' | 'IA' };
  onReply?: () => void;
  createdAt: string;
  excluded: boolean;
  onDelete?: (id: string) => void;
  isMobileLayout?: boolean;
  avatarUrl?: string;
}

const renderMessageContent = ({ mimetype, base64, text }: MessageBubbleProps) => {
  const type = mimetype || 'text';

  if (type === 'image/png' && base64) {
    return (
      <>
        <img
          src={base64}
          alt="Imagem enviada"
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
        src={base64}
        alt="Sticker"
        className={styles.stickerImage}
        loading="lazy"
      />
    );
  }

  if (type !== 'text' && base64) {
    return (
      <div className={styles.documentContainer}>
        <span className={styles.documentIcon}>📄</span>
        <a href={`${base64}`} download={text || 'arquivo'} className={styles.documentLink}>
          {text || 'Baixar Documento'}
        </a>
      </div>
    );
  }

  if (type === 'texto' && !text) {
    return (
      <div className={styles.documentContainer}>
        Seu navegador não suporta esse tipo de mensagem.
      </div>
    );
  }

  if (!text) return null;

  return (
    <p className={styles.messageText}>
      {text.split('\n').map((line, idx) => (
        <span key={idx}>
          {line.trim()}
          <br />
        </span>
      ))}
    </p>
  );
};

export default function MessageBubble(props: MessageBubbleProps) {
  const { id, sender, mimetype, onReply, quote, senderName, createdAt, excluded, avatarUrl, base64 } = props;

  const parseToLocalDate = (utcTimestamp: string): Date => {
    if (utcTimestamp && !utcTimestamp.endsWith('Z')) {
      const isoString = utcTimestamp.replace(' ', 'T') + 'Z';
      return new Date(isoString);
    }
    return new Date(utcTimestamp);
  };

  const createdAtLocal = parseToLocalDate(createdAt);

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
    const scroller: HTMLElement | Window = maybeEl instanceof HTMLElement ? maybeEl : window;

    const scrollerRect =
      scroller instanceof Window
        ? ({ top: 0, bottom: window.innerHeight } as DOMRect)
        : scroller.getBoundingClientRect();

    if (menuRef.current && !menuHeightRef.current) menuHeightRef.current = menuRef.current.offsetHeight;

    const estimatedMenuHeight = menuHeightRef.current || 200;
    const spaceBelow = scrollerRect.bottom - bubbleRect.bottom;
    const spaceAbove = bubbleRect.top - scrollerRect.top;

    const shouldUseTop = spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow;
    setMenuPosition(shouldUseTop ? 'top' : 'bottom');
  };

  useEffect(() => {
    const isOpenHere = openMenuId === `message-${id}`;
    if (!isOpenHere) return;

    const tick = () => {
      computePosition();
      requestAnimationFrame(computePosition);
    };
    const t = setTimeout(tick, 0);

    const maybeEl = bubbleRef.current?.closest('[data-scroll="messages"]');
    const scroller: HTMLElement | Window = maybeEl instanceof HTMLElement ? maybeEl : window;

    const onScrollOrResize = () => requestAnimationFrame(computePosition);

    window.addEventListener('resize', onScrollOrResize);
    if (scroller instanceof Window) scroller.addEventListener('scroll', onScrollOrResize, { passive: true });
    else scroller.addEventListener('scroll', onScrollOrResize, { passive: true });

    const ro = new ResizeObserver(() => requestAnimationFrame(computePosition));
    if (menuRef.current) ro.observe(menuRef.current);

    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', onScrollOrResize);
      if (scroller instanceof Window) scroller.removeEventListener('scroll', onScrollOrResize);
      else scroller.removeEventListener('scroll', onScrollOrResize);
      ro.disconnect();
    };
  }, [openMenuId, id]);

  useEffect(() => {
    const isOpenHere = openMenuId === `message-${id}`;
    setShowMenu(isOpenHere);
    if (!isOpenHere) setIsHovered(false);
  }, [openMenuId, id]);

  const handleTriggerClick = () => setIsHovered(true);

  const bubbleClasses = [
    styles.messageBubble,
    sender === 'me' ? styles.isMe : styles.isOther,
    mimetype === 'sticker' ? styles.stickerBubble : '',
    excluded ? styles.isExcluded : '',
  ].join(' ');

  let messageContent;

  if (mimetype?.startsWith('audio') && base64) {
    // 🎧 renderiza áudio com hora dentro
    messageContent = (
      <CustomAudioPlayer
        src={base64}
        avatarUrl={avatarUrl}
        time={createdAtLocal.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      />
    );
  } else {
    // 📝 renderiza texto, imagem, documento...
    messageContent = renderMessageContent(props);
  }

  return (
    <motion.div
      ref={bubbleRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0, duration: 0.1, ease: 'linear' }}
      className={bubbleClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => !showMenu && setIsHovered(false)}
    >
      {quote && (
        <div className={styles.quotedMessage}>
          <span className={styles.quotedSender}>{quote.remetente === 'Usuário' ? 'Você' : senderName}</span>
          <p className={styles.quotedText}>
            {quote.mensagem || (quote.mimetype?.startsWith('image/') ? '📷 Imagem' : 'Mensagem')}
          </p>
        </div>
      )}

      {messageContent}

      {excluded && (
        <div className={styles.deletedOverlay}>
          <i>🚫 Mensagem apagada</i>
        </div>
      )}

      {/* Hora da mensagem só fora se não for áudio */}
      {!mimetype?.startsWith('audio') && (
        <span className={styles.time}>
          {createdAtLocal.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </span>
      )}

      {!excluded && (isHovered || showMenu) && (
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
          className={`${styles.messageMenu} ${sender === 'me' ? styles.menuRight : styles.menuLeft}`}
        >
          <button onClick={() => onReply?.()}>
            <Icon nome="arrow" /> {props.isMobileLayout ? 'Responder' : 'Responder Mensagem'}
          </button>

          {props.text && (
            <button onClick={() => navigator.clipboard.writeText(props.text || '')}>
              <Icon nome="copy" /> {props.isMobileLayout ? 'Copiar' : 'Copiar mensagem'}
            </button>
          )}

          <button onClick={() => props.onDelete?.(id)}>
            <Icon nome="trash" /> {props.isMobileLayout ? 'Apagar' : 'Apagar mensagem'}
          </button>
        </DropdownMenu>
      )}
    </motion.div>
  );
}