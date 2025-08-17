// ChatWindow.tsx
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, MenuItem, MenuItems, MenuButton } from '@headlessui/react';
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
}

export default function ChatWindow({
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
  handleCloseReply,
}: ChatWindowProps) {
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [isRenameOpen, setRenameOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [showError, setShowError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // dentro do ChatWindow
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (replyingTo && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select?.();
    }
  }, [replyingTo]);

  // 👇 Novo efeito: fecha reply com Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && replyingTo) {
        handleCloseReply();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [replyingTo, handleCloseReply]);


  const { isDragging, handleDragOver, handleDragLeave, handleDrop } = useDragAndDropFile({ onDropFile });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  return (
    <motion.section
      className={styles.chatWindow}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
    >
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
            <NavLink to="/agentes">
              <span>
                Agente - {activeChat.connection.agente.tipo_de_agente}
              </span>
            </NavLink>
          </div>
        </div>

        <DropdownMenu
          id="chat-header"
          trigger={<button className={styles.optionsButton}><Icon nome="dots" /></button>}
        >
          <button onClick={() => { setNewName(activeChat.contato_nome || ''); setRenameOpen(true); }}>
            <Icon nome="pencil" /> Renomear Chat
          </button>
          <button onClick={onDeleteChat}>
            <Icon nome="trash" /> Apagar Chat
          </button>
          <button onClick={() => setDetailsOpen(true)}>
            <Icon nome="info" /> Detalhes do Chat
          </button>
          <button onClick={onToggleChatStatus}>
            <Icon nome="close" /> {activeChat.status === 'Open' ? 'Fechar Chat' : 'Reabrir Chat'}
          </button>
        </DropdownMenu>
      </header>

      {/* Modals */}
      <Modal
        transparent
        isOpen={isDetailsOpen}
        onClose={() => setDetailsOpen(false)}
        title="Detalhes do Chat"
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
        labelSubmit="Salvar"
        transparent
        isOpen={isRenameOpen}
        onClose={() => setRenameOpen(false)}
        title="Renomear Chat"
      >
        <div className={FormStyles.formGroup}>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Novo nome"
          />
          {showError && !newName.trim() && (
            <span className={FormStyles.errorText}>
              O nome não pode ficar vazio.
            </span>
          )}
        </div>
      </Modal>

      {/* Drag Overlay */}
      {isDragging && (
        <div className={styles.dragOverlay}>
          <p>📄 Solte o arquivo para enviar</p>
        </div>
      )}

      {/* Messages */}
      <div
        className={styles.messageList}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-scroll="messages"  
      >
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            id={msg.id}
            senderName={activeChat.contato_nome}
            text={msg.mensagem}
            mimetype={msg.mimetype}
            base64={msg.base64}
            sender={msg.remetente === 'cliente' ? 'me' : 'other'}
            quote={
              msg.quote_message
                ? {
                  mensagem: msg.quote_message.mensagem,
                  mimetype: msg.quote_message.mimetype,
                  remetente: msg.quote_message.remetente as
                    | 'cliente'
                    | 'humano',
                }
                : undefined
            }
            onReply={() => onSetReplyingTo(msg)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={styles.inputAreaWrapper}>
        {activeChat.status === 'Open' ? (
          <>
            {replyingTo && (
              <div
                className={`${styles.replyPreview} ${isExiting ? styles.isExiting : ''
                  }`}
              >
                <div>
                  <span>
                    {replyingTo.remetente === 'cliente' ? 'Você' : 'Contato'}
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
              <div className={styles.toggleIaButton}>
                <div className={styles.headerToggleIa}>
                  <Icon nome="agentespage" />{' '}
                  {activeChat.ia_ativa ? 'Ativado' : 'Desativado'}
                </div>
                <ToggleSwitch
                  variant="secondary"
                  isOn={activeChat.ia_ativa}
                  onToggle={onToggleIA}
                />
              </div>

              <ChatInput
                ref={inputRef}
                placeholder="Digite uma mensagem"
                onSend={(text) => onSendMessage(text)}
              />
            </div>
          </>
        ) : (
          <div className={styles.chatClosedBanner}>
            <p>Este chat está fechado.</p>
            <button onClick={onToggleChatStatus}>Reabrir</button>
          </div>
        )}
      </div>
    </motion.section>
  );
}


