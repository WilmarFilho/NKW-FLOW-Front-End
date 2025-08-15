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

interface ChatWindowProps {
  activeChat: Chat | null;
  messages: Message[];
  onSendMessage: (text?: string, mimetype?: string, base64?: string) => void;
  onToggleIA: () => void;
  onDeleteChat: () => void;
  onToggleChatStatus: () => void;
  onRenameChat: (newName: string) => void;
  onDropFile: (file: File) => void;
}

export default function ChatWindow({
  activeChat,
  messages,
  onSendMessage,
  onToggleIA,
  onDeleteChat,
  onToggleChatStatus,
  onRenameChat,
  onDropFile
}: ChatWindowProps) {

  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [isRenameOpen, setRenameOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [showError, setShowError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { isDragging, handleDragOver, handleDragLeave, handleDrop } = useDragAndDropFile({
    onDropFile
  });

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
    return <div className={styles.fallbackContainer}><p>Selecione uma conversa para começar.</p></div>;
  }

  return (
    <motion.section className={styles.chatWindow} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
      <header className={styles.chatHeader}>
        <div className={styles.contactInfo} onClick={() => setDetailsOpen(true)} style={{ cursor: 'pointer' }}>
          <img src={activeChat.foto_perfil || defaultAvatar} alt={`Avatar de ${activeChat.contato_nome}`} />
          <div className={styles.contactText}>
            <h1>{activeChat.contato_nome}</h1>
            <NavLink to="/agentes"><span>Agente - {activeChat.connection.agente.tipo_de_agente} </span></NavLink>
          </div>
        </div>

        <Menu as="div" className={styles.dropdown}>
          {({ open }) => (
            <>
              <MenuButton className={styles.optionsButton}><Icon nome='dots' /></MenuButton>
              <AnimatePresence>
                {open && (
                  <MenuItems static>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -5 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className={styles.menuItems}
                    >

                      <MenuItem>{() => <button onClick={() => { setNewName(activeChat.contato_nome || ''); setRenameOpen(true); }}><Icon nome='pencil' />Renomear Chat</button>}</MenuItem>
                      <MenuItem>{() => <button onClick={onDeleteChat}><Icon nome='trash' />Apagar Chat</button>}</MenuItem>
                      <MenuItem>{() => <button onClick={() => setDetailsOpen(true)}><Icon nome='info' />Detalhes do Chat</button>}</MenuItem>
                      <MenuItem>{() => <button onClick={onToggleChatStatus}><Icon nome='close' />{activeChat.status === 'Open' ? 'Fechar Chat' : 'Reabrir Chat'}</button>}</MenuItem>
                    </motion.div>
                  </MenuItems>
                )}
              </AnimatePresence>
            </>
          )}
        </Menu>
      </header>

      {/* Modals */}
      <Modal transparent isOpen={isDetailsOpen} onClose={() => setDetailsOpen(false)} title="Detalhes do Chat">
        <div className={styles.chatDetails}>
          <img src={activeChat.foto_perfil || defaultAvatar} alt={`Avatar de ${activeChat.contato_nome}`} />
          <h2>{activeChat.contato_nome}</h2>
          <h3>{activeChat.contato_numero}</h3>
        </div>
      </Modal>

      <Modal onSave={handleRenameClick} labelSubmit='Salvar' transparent isOpen={isRenameOpen} onClose={() => setRenameOpen(false)} title="Renomear Chat">
        <div className={FormStyles.formGroup}>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Novo nome" />
          {showError && !newName.trim() && <span className={FormStyles.errorText}>O nome não pode ficar vazio.</span>}
        </div>
      </Modal>

      {/* Drag Overlay */}
      {isDragging && <div className={styles.dragOverlay}><p>📄 Solte o arquivo para enviar</p></div>}

      {/* Messages */}
      <div className={styles.messageList} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        {messages.map(msg => (
          <MessageBubble key={msg.id} text={msg.mensagem} mimetype={msg.mimetype} base64={msg.base64} sender={msg.remetente === 'cliente' ? 'me' : 'other'} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={styles.inputAreaWrapper}>
        {activeChat.status === 'Open' ? (
          <div className={styles.inputArea}>
            <div className={styles.toggleIaButton}>
              <div className={styles.headerToggleIa}>
                <Icon nome='agentespage' /> {activeChat.ia_ativa ? 'Ativado' : 'Desativado'}
              </div>
              <ToggleSwitch variant="secondary" isOn={activeChat.ia_ativa} onToggle={onToggleIA} />
            </div>
            <ChatInput placeholder="Digite uma mensagem" onSend={(text) => onSendMessage(text)} />
          </div>
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