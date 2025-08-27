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

export default function MessageBubble(props: MessageBubbleProps) {
  const { id, sender, mimetype, onReply, quote, senderName, createdAt, excluded, avatarUrl, base64, text } = props;

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

  // ✅ Estado para o lightbox
  const [expandedMedia, setExpandedMedia] = useState<string | null>(null);
  const [expandedType, setExpandedType] = useState<'image' | 'video' | null>(null);

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
        ? ({ top: 0, bottom: window.innerHeight } as unknown as DOMRect)
        : (scroller as HTMLElement).getBoundingClientRect();

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
      else (scroller as HTMLElement).removeEventListener('scroll', onScrollOrResize);
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

  // 👉 Render do conteúdo da mensagem (agora tem acesso aos setters do lightbox)
  const renderMessageContent = () => {
    const type = mimetype || 'text';

    // Imagem (png) com click para expandir
    if (type === 'image/png' && base64) {
      return (
        <>
          <img
            src={base64}
            alt="Imagem enviada"
            className={styles.messageImage}
            loading="lazy"
            onClick={() => {
              setExpandedMedia(base64);
              setExpandedType('image');
            }}
          />
          {text && <p>{text}</p>}
        </>
      );
    }

    // Sticker webp (sem expansão)
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

    // Vídeo mp4 (preview clicável; controles apenas no overlay)
    if (type === 'video/mp4' && base64) {
      return (
        <video
          src={base64}
          className={styles.messageImage}
          preload="metadata"
          playsInline
          muted
          onClick={() => {
            setExpandedMedia(base64);
            setExpandedType('video');
          }}
        />
      );
    }

    // Documento genérico (download)
    if (type !== 'text' && base64) {
      return (
        <div className={styles.documentContainer}>
          <span className={styles.documentIcon}>📄</span>
          <a href={base64} download={text || 'arquivo'} className={styles.documentLink}>
            {text || 'Baixar Documento'}
          </a>
        </div>
      );
    }

    // 🚫 Não suportado: quando não é texto e não há base64
    if (type !== 'texto' && !base64) {
      return <div className={styles.documentContainer}>🚫 Tipo de mensagem não suportado.</div>;
    }

    // Texto
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

  // 🔒 UX: trava scroll do body e fecha com ESC quando lightbox ativo
  useEffect(() => {
    if (!expandedMedia) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setExpandedMedia(null);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [expandedMedia]);

  return (
    <>
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
              {quote.mensagem
                || (quote.mimetype?.startsWith('image/') ? '📷 Imagem'
                : quote.mimetype?.startsWith('video/') ? '🎬 Vídeo'
                : 'Mensagem')}
            </p>
          </div>
        )}

        {/* Conteúdo principal */}
        {mimetype?.startsWith('audio') && base64 ? (
          <CustomAudioPlayer
            src={base64}
            avatarUrl={avatarUrl}
            time={createdAtLocal.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          />
        ) : (
          renderMessageContent()
        )}

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

            {/* Só aparece se for mensagem do usuário e dentro de 5 min */}
            {sender === 'me' &&
              (Date.now() - createdAtLocal.getTime() <= 5 * 60 * 1000) && (
                <button onClick={() => props.onDelete?.(id)}>
                  <Icon nome="trash" /> {props.isMobileLayout ? 'Apagar' : 'Apagar mensagem'}
                </button>
              )}
          </DropdownMenu>
        )}
      </motion.div>

      {/* Overlay para imagem/vídeo expandido */}
      {expandedMedia && (
        <div className={styles.mediaOverlay} onClick={() => setExpandedMedia(null)}>
          <button className={styles.closeButton} onClick={() => setExpandedMedia(null)}><Icon nome='close' /></button>
          <div className={styles.mediaContainer} onClick={(e) => e.stopPropagation()}>
            
            {expandedType === 'image' ? (
              <img src={expandedMedia} alt="Visualização" className={styles.mediaFull} />
            ) : (
              <video src={expandedMedia} className={styles.mediaFull} controls autoPlay />
            )}
          </div>
        </div>
      )}
    </>
  );
}
