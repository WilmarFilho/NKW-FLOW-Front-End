import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Chat } from '../../../types/chats';
import { Message } from '../../../types/message';
import { useDragAndDropFile } from '../../../hooks/utils/useDragAndDropFile';
import MessageBubble from '../MessageBubble/MessageBubble';
import ChatInput from '../../Gerais/Inputs/ChatInput';
import Modal from '../../Gerais/Modal/Modal';
import ToggleSwitch from '../../Configuracoes/ToggleSwitch/ToggleSwitch';
import Icon from '../../Gerais/Icons/Icons';
import defaultAvatar from '../assets/default.webp';
import styles from './ChatWindow.module.css';
import FormStyles from '../../Gerais/Form/form.module.css';
import { DropdownMenu } from '../../../components/Gerais/Dropdown/DropdownMenu';
import { useRecoilValue } from 'recoil';
import { userState } from '../../../state/atom';

interface ChatWindowProps {
  activeChat: Chat | null;
  messages: Message[];
  onSendMessage: (text?: string, mimetype?: string, base64?: string) => void;
  onToggleIA: () => void;
  onDeleteChat: () => void;
  onToggleChatStatus: () => void;
  onRenameChat: (newName: string) => void;
  onDropFile: (file: File) => void;
  onSetReplyingTo: (msg: Message | undefined) => void;
  replyingTo: Message | undefined;
  isExiting: boolean;
  setIsExiting: React.Dispatch<React.SetStateAction<boolean>>;
  handleCloseReply: () => void;
  onDeleteMessage: (id: string) => void;
  fetchMoreMessages: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export default function ChatWindow({
  fetchMoreMessages,
  hasMore,
  isLoading,
  activeChat,
  messages,
  onSendMessage,
  onToggleIA,
  onDeleteChat,
  onToggleChatStatus,
  onRenameChat,
  onDropFile,
  onSetReplyingTo,
  replyingTo,
  isExiting,
  onDeleteMessage,
  handleCloseReply,
}: ChatWindowProps) {
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [isRenameOpen, setRenameOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [showError, setShowError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const user = useRecoilValue(userState);
  const isOwner = !activeChat?.user_id || activeChat?.user_id === user?.id;

  const { isDragging, handleDragOver, handleDragLeave, handleDrop } =
    useDragAndDropFile({ onDropFile });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const prevScrollHeightRef = useRef<number | null>(null);

  // Rastrear se é carregamento inicial
  const isInitialLoadRef = useRef(true);

  // Reset flag ao trocar de chat
  useEffect(() => {
    isInitialLoadRef.current = true;
  }, [activeChat]);

  // Intersection Observer para scroll infinito
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          prevScrollHeightRef.current = list.scrollHeight;
          fetchMoreMessages();
        }
      },
      {
        root: list,
        rootMargin: '1000px 0px 0px 0px',
        threshold: 0.0,
      }
    );

    const sentinel = topSentinelRef.current;
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [fetchMoreMessages, hasMore, isLoading]);

  // Lógica de Scroll
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    // Paginando para cima
    if (prevScrollHeightRef.current !== null) {
      const newScrollHeight = list.scrollHeight;
      list.scrollTop = newScrollHeight - prevScrollHeightRef.current;
      prevScrollHeightRef.current = null;
      return;
    }

    // Carregamento inicial
    if (isInitialLoadRef.current && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView();
      isInitialLoadRef.current = false;
      return;
    }

    // Nova mensagem em chat aberto
    if (!isInitialLoadRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // só depende das mensagens

  // Foco no campo de resposta
  useEffect(() => {
    if (replyingTo && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select?.();
    }
  }, [replyingTo]);

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 991.98px)');
    setIsSmallScreen(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsSmallScreen(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => onSetReplyingTo(undefined), [activeChat]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && replyingTo) handleCloseReply();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [replyingTo, handleCloseReply]);

  const handleRenameClick = () => {
    if (!newName.trim()) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onRenameChat(newName.trim());
    setRenameOpen(false);
  };

  if (!activeChat) {
    return (
      <div className={styles.fallbackContainer}>
        <p>Selecione uma conversa para começar.</p>
      </div>
    );
  }

  // --- Agrupamento de mensagens ---
  const groupedMessages: React.ReactNode[] = [];
  let lastDate: string | null = null;

  const parseToLocalDate = (utcTimestamp: string): Date => {
    if (utcTimestamp && !utcTimestamp.endsWith('Z')) {
      const isoString = utcTimestamp.replace(' ', 'T') + 'Z';
      return new Date(isoString);
    }
    return new Date(utcTimestamp);
  };

  // Deduplica mensagens
  const uniqueMessages = Array.from(
    new Map(messages.map((m) => [m.id, m])).values()
  );

  uniqueMessages.forEach((msg) => {
    const localMsgDate = parseToLocalDate(msg.criado_em);
    const msgDateKey = localMsgDate.toDateString();

    if (msgDateKey !== lastDate) {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      let displayDate = '';
      if (msgDateKey === today) displayDate = 'Hoje';
      else if (msgDateKey === yesterday) displayDate = 'Ontem';
      else
        displayDate = localMsgDate.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        });

      groupedMessages.push(
        <div key={`divider-${msgDateKey}`} className={styles.dateDivider}>
          <span>{displayDate}</span>
        </div>
      );
      lastDate = msgDateKey;
    }

    groupedMessages.push(
      <MessageBubble
        key={msg.id}
        id={msg.id}
        senderName={activeChat.contato_nome}
        text={msg.mensagem}
        mimetype={msg.mimetype}
        base64={msg.base64}
        sender={msg.remetente === 'Usuário' ? 'me' : 'other'}
        createdAt={msg.criado_em}
        excluded={msg.excluded}
        quote={
          msg.quote_message
            ? {
              mensagem: msg.quote_message.mensagem,
              mimetype: msg.quote_message.mimetype,
              remetente: msg.quote_message
                .remetente as 'Usuário' | 'Contato' | 'IA',
            }
            : undefined
        }
        onReply={() => onSetReplyingTo(msg)}
        onDelete={onDeleteMessage}
      />
    );
  });

  return (
    <motion.section
      className={styles.chatWindow}
      initial={isSmallScreen ? { opacity: 0 } : { opacity: 0, x: 30 }}
      animate={isSmallScreen ? { opacity: 1 } : { opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
    >

      {!isSmallScreen && (
        <header className={styles.chatHeader}>
          <div
            className={styles.contactInfo}
            onClick={() => setDetailsOpen(true)}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={activeChat.foto_perfil || defaultAvatar}
              alt={`Avatar de ${activeChat.contato_nome}`}
            />
            <div className={styles.contactText}>
              <h1>{activeChat.contato_nome}</h1>
              <NavLink to='/agentes'>
                <span>
                  Agente - {activeChat.connection.agente.tipo_de_agente}
                </span>
              </NavLink>
            </div>
          </div>

          <DropdownMenu
            id='chat-header'
            trigger={
              <button className={styles.optionsButton}>
                <Icon nome='dots' />
              </button>
            }
          >
            {isOwner && (
              <>
                <button
                  onClick={() => {
                    setNewName(activeChat.contato_nome || '');
                    setRenameOpen(true);
                  }}
                >
                  <Icon nome='pencil' /> Renomear Chat
                </button>
                <button onClick={onDeleteChat}>
                  <Icon nome='trash' /> Apagar Chat
                </button>
                <button onClick={onToggleChatStatus}>
                  <Icon nome='close' />{' '}
                  {activeChat.status === 'Open'
                    ? 'Fechar Chat'
                    : 'Reabrir Chat'}
                </button>
              </>
            )}
            <button onClick={() => setDetailsOpen(true)}>
              <Icon nome='info' /> Detalhes do Chat
            </button>
          </DropdownMenu>
        </header>
      )}

      <Modal
        transparent
        isOpen={isDetailsOpen}
        onClose={() => setDetailsOpen(false)}
        title='Detalhes do Chat'
      >
        <div className={styles.chatDetails}>
          <img
            src={activeChat.foto_perfil || defaultAvatar}
            alt={`Avatar de ${activeChat.contato_nome}`}
          />
          <h2>{activeChat.contato_nome}</h2>
          <h3>{activeChat.contato_numero}</h3>
        </div>
      </Modal>

      <Modal
        onSave={handleRenameClick}
        labelSubmit='Salvar'
        transparent
        isOpen={isRenameOpen}
        onClose={() => setRenameOpen(false)}
        title='Renomear Chat'
      >
        <div className={FormStyles.formGroup}>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder='Novo nome'
          />
          {showError && !newName.trim() && (
            <span className={FormStyles.errorText}>
              O nome não pode ficar vazio.
            </span>
          )}
        </div>
      </Modal>

      {isDragging && (
        <div className={styles.dragOverlay}>
          <p>📄 Solte o arquivo para enviar</p>
        </div>
      )}

      <div
        ref={listRef}
        className={styles.messageList}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-scroll='messages'
      >
        <div ref={topSentinelRef} style={{ height: '1px' }} />
        {groupedMessages}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputAreaWrapper}>
        {isOwner ? (
          activeChat.status === 'Open' ? (
            <>
              {replyingTo && (
                <div
                  className={`${styles.replyPreview} ${isExiting ? styles.isExiting : ''
                    }`}
                >
                  <div>
                    <span>
                      {replyingTo.remetente === 'Usuário'
                        ? 'Você'
                        : 'Contato'}
                    </span>
                    <p>
                      {replyingTo.mensagem ||
                        (replyingTo.mimetype?.startsWith('image/')
                          ? '📷 Imagem'
                          : 'Mensagem')}
                    </p>
                    <button onClick={handleCloseReply}>✖</button>
                  </div>
                </div>
              )}

              <div className={styles.inputArea}>
                {!isSmallScreen && (
                  <div className={styles.toggleIaButton}>
                    <div className={styles.headerToggleIa}>
                      <Icon nome='agentespage' />{' '}
                      {activeChat.ia_ativa ? 'Ativado' : 'Desativado'}
                    </div>
                    <ToggleSwitch
                      variant='secondary'
                      isOn={activeChat.ia_ativa}
                      onToggle={onToggleIA}
                    />
                  </div>
                )}

                {/* Só renderiza no header se tela < 992px */}
                {isSmallScreen && (
                  <div className={styles.toggleIaButton}>
                    <div className={styles.headerToggleIa}>
                      <Icon nome='agentespage' />{' '}
                    </div>
                    <ToggleSwitch
                      variant='secondary'
                      isOn={activeChat.ia_ativa}
                      onToggle={onToggleIA}
                    />
                  </div>
                )}

                <ChatInput
                  ref={inputRef}
                  placeholder='Digite uma mensagem'
                  onSend={(text, mimetype, base64) =>
                    onSendMessage(text, mimetype, base64)
                  }
                />
                {/* Dropdown vai para o footer se for tela pequena */}
                {isSmallScreen && (
                  <DropdownMenu
                    id='chat-footer'
                    trigger={
                      <button className={styles.optionsButton}>
                        <Icon nome='dots' />
                      </button>
                    }
                  >
                    {isOwner && (
                      <>
                        <button
                          onClick={() => {
                            setNewName(activeChat.contato_nome || '');
                            setRenameOpen(true);
                          }}
                        >
                          <Icon nome='pencil' /> Renomear Chat
                        </button>
                        <button onClick={onDeleteChat}>
                          <Icon nome='trash' /> Apagar Chat
                        </button>
                        <button onClick={onToggleChatStatus}>
                          <Icon nome='close' />{' '}
                          {activeChat.status === 'Open'
                            ? 'Fechar Chat'
                            : 'Reabrir Chat'}
                        </button>
                      </>
                    )}
                    <button onClick={() => setDetailsOpen(true)}>
                      <Icon nome='info' /> Detalhes do Chat
                    </button>
                  </DropdownMenu>
                )}
                
              </div>

            </>
          ) : (
            <div className={styles.chatClosedBanner}>
              <button
                className={styles.buttonReOpen}
                onClick={onToggleChatStatus}
              >
                Reabrir Chat
              </button>
            </div>
          )
        ) : (
          <div className={styles.chatClosedBanner}>
            <button
              className={styles.buttonReOpen}
              onClick={onToggleChatStatus}
            >
              Chat em andamento por: {activeChat.user_nome}
            </button>
          </div>
        )}
      </div>
    </motion.section>
  );
}