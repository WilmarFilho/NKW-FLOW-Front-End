// Libs
import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, MenuItem, MenuItems, MenuButton } from '@headlessui/react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { NavLink } from 'react-router-dom';
// Recoil
import { userState, chatsState } from '../../../state/atom';
// Components
import MessageBubble from '../MessageBubble/MessageBubble';
import ChatInput from '../../Gerais/Inputs/ChatInput';
import Modal from '../../Gerais/Modal/Modal';
import ToggleSwitch from '../../Configuracoes/ToggleSwitch/ToggleSwitch';
// Types
import { Chat } from '../../../types/chats';
import { Message } from '../../../types/message';
// Hooks
import useSendMessage from '../../../hooks/chats/useSendMessage';
import useChatActions from '../../../hooks/chats/useChatActions';
import { useDragAndDropFile } from '../../../hooks/chats/useDragAndDropFile';
// Assets
import defaultAvatar from '../assets/default.webp';
// Icons
import Icon from '../../Gerais/Icons/Icons';
// Css
import styles from './ChatWindow.module.css';
import FormStyles from '../../Gerais/Form/form.module.css'

interface ChatWindowProps {
    activeChat: Chat | null;
    messages: Message[];
    setActiveChat: (chat: Chat | null) => void;
}

export default function ChatWindow({ activeChat, messages, setActiveChat }: ChatWindowProps) {
    // Recoil state
    const [user] = useRecoilState(userState);
    const setChats = useSetRecoilState(chatsState);

    // Custom hooks
    const { sendMessage } = useSendMessage();
    const { reOpenChat, deleteChat, renameChat, toggleIA } = useChatActions();

    // Modals
    const [isDetailsOpen, setDetailsOpen] = useState(false);
    const [isRenameOpen, setRenameOpen] = useState(false);
    const [newName, setNewName] = useState('');

    const [showError, setShowError] = useState(false);

    // Drag & drop
    const handleFileDrop = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            const messageText = file.type.startsWith('image/') ? '' : file.name;
            handleSendMessage(messageText, file.type, base64);
        };
        reader.readAsDataURL(file);
    }, []);

    const { isDragging, handleDragOver, handleDragLeave, handleDrop } = useDragAndDropFile({
        onDropFile: handleFileDrop,
    });

    // Refs
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Scroll para a última mensagem
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handlers 
    const handleSendMessage = useCallback(async (text: string, mimetype?: string, base64?: string) => {
        if (!activeChat) return;

        const result = await sendMessage({
            chat_id: activeChat.id,
            mensagem: text,
            user_id: user?.id,
            mimetype,
            base64,
        });

        if (result) {
            const lastMessageText =
                text ||
                (mimetype?.startsWith('image/')
                    ? '📷 Imagem'
                    : mimetype?.startsWith('audio/')
                        ? '🎙️ Áudio'
                        : '📄 Documento');

            const updatedChat = { ...activeChat, ultima_mensagem: lastMessageText };
            setActiveChat(updatedChat);
            setChats(prev => prev.map(chat => (chat.id === updatedChat.id ? updatedChat : chat)));
        }
    }, [activeChat, sendMessage, setActiveChat, setChats, user?.id]);

    const handleToggleIA = useCallback(async () => {
        if (!activeChat) return;

        const updatedIaStatus = await toggleIA(activeChat.id, activeChat.ia_ativa);
        if (updatedIaStatus !== null) {
            const updatedChat = { ...activeChat, ia_ativa: updatedIaStatus };
            setActiveChat(updatedChat);

            setChats(prev =>
                prev.map(chat =>
                    chat.id === updatedChat.id ? updatedChat : chat
                )
            );
        }
    }, [activeChat, toggleIA, setActiveChat]);

    const handleDeleteChat = useCallback(async () => {
        if (!activeChat) return;
        if (window.confirm('Tem certeza?')) {
            await deleteChat(activeChat.id);
            setActiveChat(null);
        }
    }, [activeChat, deleteChat, setActiveChat]);

    const handleToggleChatStatus = useCallback(async () => {
        if (!activeChat) return;

        const newStatus = activeChat.status === 'Open' ? 'Close' : 'Open';

        const result = await reOpenChat(activeChat.id, newStatus);
        if (result) {
            const updatedChat = { ...activeChat, status: newStatus };
            setActiveChat(updatedChat);
            setChats(prev => prev.map(chat => (chat.id === updatedChat.id ? updatedChat : chat)));
        }
    }, [activeChat, reOpenChat, setActiveChat, setChats]);

    const handleRenameChat = useCallback(async () => {

        if (!activeChat || !newName.trim()) {
            setShowError(true);
            return;
        }

        setShowError(false);

        await renameChat(activeChat.id, newName.trim());
        setActiveChat({ ...activeChat, contato_nome: newName.trim() });
        setRenameOpen(false);
    }, [activeChat, newName, renameChat, setActiveChat]);

    if (!activeChat) {
        return (
            <div className={styles.fallbackContainer}>
                <p>Selecione uma conversa para começar.</p>
            </div>
        );
    }

    const renderMenuItems = () => (
        <MenuItems static>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className={styles.menuItems}
            >
                <MenuItem>
                    {({ active }) => (
                        <button
                            onClick={() => {
                                setNewName(activeChat.contato_nome || '');
                                setRenameOpen(true);
                            }}
                            className={active ? styles.activeOption : ''}
                        >
                            <Icon nome='pencil' />
                            Renomear a conversa.
                        </button>
                    )}
                </MenuItem>

                <MenuItem>
                    {({ active }) => (
                        <button
                            onClick={handleDeleteChat}
                            className={active ? styles.activeOption : ''}
                        >
                            <Icon nome='trash' />
                            Apagar conversa.
                        </button>
                    )}
                </MenuItem>

                <MenuItem>
                    {({ active }) => (
                        <button
                            onClick={() => setDetailsOpen(true)}
                            className={active ? styles.activeOption : ''}
                        >
                            <Icon nome='info' />
                            Dados da conversa.
                        </button>
                    )}
                </MenuItem>

                <MenuItem>
                    {({ active }) => (
                        <button
                            onClick={handleToggleChatStatus}
                            className={active ? styles.activeOption : ''}
                        >
                            {activeChat.status === 'Open' ? (
                                <>
                                    <Icon nome='close' />
                                    Fechar conversa.
                                </>
                            ) : (
                                <>
                                    <Icon nome='play' />
                                    Reabrir conversa.
                                </>
                            )}
                        </button>
                    )}
                </MenuItem>
            </motion.div>
        </MenuItems>
    );

    return (
        <motion.section
            className={styles.chatWindow}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
        >
            {/* Header */}
            <header className={styles.chatHeader}>
                <div
                    className={styles.contactInfo}
                    onClick={() => setDetailsOpen(true)}
                    style={{ cursor: 'pointer' }}
                    role="button"
                    tabIndex={0}
                    onKeyPress={e => { if (e.key === 'Enter') setDetailsOpen(true); }}
                >
                    <img src={activeChat.foto_perfil || defaultAvatar} alt={`Avatar de ${activeChat.contato_nome}`} />
                    <div className={styles.contactText}>
                        <h1>{activeChat.contato_nome}</h1>
                        <NavLink to="/agentes">
                            <span>Agente - {activeChat.connection.agente.tipo_de_agente} </span>
                        </NavLink>
                    </div>
                </div>

                <Menu as="div" className={styles.dropdown}>
                    {({ open }) => (
                        <>
                            <MenuButton className={styles.optionsButton}>
                                <Icon nome='dots' />
                            </MenuButton>

                            <AnimatePresence>
                                {open && renderMenuItems()}
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

                    <div className={styles.bottomDetails}>
                        <NavLink to="/agentes">
                            <p>Agente - {activeChat.connection.agente.tipo_de_agente} </p>
                        </NavLink>
                        <strong className={activeChat.ia_ativa ? styles.statusIaActive : styles.statusIaInactive}>
                            {activeChat.ia_ativa ? 'IA Ativa' : 'IA Desativada'}
                        </strong>
                    </div>
                </div>
            </Modal>

            <Modal onSave={handleRenameChat} labelSubmit='Salvar' transparent isOpen={isRenameOpen} onClose={() => setRenameOpen(false)} title="Renomear Chat">
                <div className={FormStyles.formGroup}>
                    <label htmlFor="nome">Nome Atual do Chat</label>
                    <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Novo nome do contato"
                        className={styles.inputEditChat}
                    />
                    {showError && !newName.trim() && (
                        <span className={FormStyles.errorText}>O nome não pode ficar vazio.</span>
                    )}
                </div>
            </Modal>

            {/* Drag Overlay */}
            {isDragging && (
                <div className={styles.dragOverlay}>
                    <div className={styles.overlayContent}>
                        <p>📄 Solte o arquivo para enviar</p>
                    </div>
                </div>
            )}

            {/* Message List */}
            <div
                className={styles.messageList}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {messages.map(msg => (
                    <MessageBubble
                        key={msg.id}
                        text={msg.mensagem}
                        mimetype={msg.mimetype}
                        base64={msg.base64}
                        sender={msg.remetente === 'cliente' ? 'me' : 'other'}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className={styles.inputAreaWrapper}>
                {activeChat.status === 'Open' ? (
                    <div className={styles.inputArea}>
                        <div className={styles.toggleIaButton}>
                            <div className={styles.headerToggleIa}>
                                <Icon nome='agentespage' /> {activeChat.ia_ativa ? 'Ativado' : 'Desativado'}
                            </div>
                            <ToggleSwitch variant="secondary" isOn={activeChat.ia_ativa} onToggle={handleToggleIA} />
                        </div>
                        <ChatInput placeholder="Digite uma mensagem" onSend={handleSendMessage} />
                    </div>
                ) : (
                    <div className={styles.chatClosedBanner}>
                        <p>Este chat está fechado e não permite novas mensagens.</p>
                        <button onClick={handleToggleChatStatus} className={styles.buttonReOpen}>
                            Esta Conversa Está Fechada, clique para reabrir
                        </button>
                    </div>
                )}
            </div>
        </motion.section>
    );
}