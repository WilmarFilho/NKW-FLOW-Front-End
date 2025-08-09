import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, MenuItem, MenuItems, MenuButton } from '@headlessui/react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { NavLink } from 'react-router-dom';

// State
import { userState, chatsState } from '../../../state/atom';

// Components
import MessageBubble from '../MessageBubble/MessageBubble';
import ChatInput from '../../Gerais/Inputs/ChatInput';
import Modal from '../../../components/Gerais/ModalForm/Modal';

// Types
import { Chat } from '../../../types/chats';
import { Message } from '../../../types/message';

// Hooks
import useToggleIA from '../../../hooks/chats/useToggleIA';
import useSendMessage from '../../../hooks/chats/useSendMessage';
import useChats from '../../../hooks/chats/useChats';
import { useAgents } from '../../../hooks/agents/useAgents';
import { useDragAndDropFile } from '../../../hooks/chats/useDragAndDropFile';

// Assets & CSS
import defaultAvatar from '../assets/default.webp';
import DotsIcon from '../assets/dots.svg';
import EditIcon from '../assets/pencil.svg';
import TrashIcon from '../assets/trash.svg';
import InfoIcon from '../assets/info.svg'
import BotIcon from '../assets/bot.svg'
import XCircleIcon from '../assets/x-circle.svg'
import PlayIcon from '../assets/play.svg'
import styles from './ChatWindow.module.css';
import Button from '../../../components/Gerais/Buttons/Button';
import ToggleSwitch from '../../../components/Configuracoes/ToggleSwitch/ToggleSwitch';

interface ChatWindowProps {
    activeChat: Chat | null;
    messages: Message[];
    setActiveChat: (chat: Chat | null) => void;
}

export default function ChatWindow({ activeChat, messages, setActiveChat }: ChatWindowProps) {
    const [user] = useRecoilState(userState);
    const setChats = useSetRecoilState(chatsState);
    const { toggleIA } = useToggleIA();
    const { sendMessage } = useSendMessage();
    const { refetch, reOpenChat } = useChats(user?.id);
    const { agents } = useAgents();

    const [isDetailsOpen, setDetailsOpen] = useState(false);

    const [isRenameOpen, setRenameOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const { deleteChat, renameChat } = useChats(user?.id);

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

    const handleDeleteChat = async () => {
        if (window.confirm('Tem certeza?')) {
            if (!activeChat) return;
            await deleteChat(activeChat.id);
            setActiveChat(null);
        }
    };

    const handleToggleChatStatus = async () => {
        if (!activeChat) return;

        const newStatus = activeChat.status === 'Open' ? 'Close' : 'Open';

        const result = await reOpenChat(activeChat.id, newStatus);
        if (result) {
            const updatedChat = { ...activeChat, status: newStatus };
            setActiveChat(updatedChat);
            setChats((prev) =>
                prev.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
            );
        }
    };

    const handleRenameChat = async () => {
        if (!activeChat || !newName.trim()) return;
        await renameChat(activeChat.id, newName.trim());
        setActiveChat({ ...activeChat, contato_nome: newName.trim() });
        setRenameOpen(false);
    };

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const agentActive = useMemo(() => {
        if (!activeChat?.connection) return null;
        return agents.find((agent) => agent.id === activeChat.connection.agente_id);
    }, [agents, activeChat]);

    const handleSendMessage = async (text: string, mimetype?: string, base64?: string) => {
        if (!activeChat) return;
        const result = await sendMessage({
            chat_id: activeChat.id,
            mensagem: text,
            user_id: user?.id,
            mimetype,
            base64,
        });
        if (result) {
            // Atualiza a "última mensagem" de forma mais inteligente
            const lastMessageText = text ||
                (mimetype?.startsWith('image/') ? '📷 Imagem' :
                    (mimetype?.startsWith('audio/') ? '🎙️ Áudio' : '📄 Documento'));
            const updatedChat = { ...activeChat, ultima_mensagem: lastMessageText };
            setActiveChat(updatedChat);
            setChats((prev) => prev.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat)));
        }
    };

    const handleToggleIA = () => {
        if (!activeChat) return;
        toggleIA(activeChat, (updatedChat) => {
            setActiveChat(updatedChat);
            refetch();
        });
    };

    if (!activeChat) {
        return (
            <div className={styles.fallbackContainer}>
                <p>Selecione uma conversa para começar.</p>
            </div>
        );
    }

    console.log(activeChat.status)

    return (
        <motion.section
            className={styles.chatWindow}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
        >
            <header className={styles.chatHeader}>
                <div className={styles.contactInfo} onClick={() => setDetailsOpen(true)} style={{ cursor: 'pointer' }}>
                    <img src={activeChat.foto_perfil || defaultAvatar} alt={`Avatar de ${activeChat.contato_nome}`} />
                    <div className={styles.contactText}>
                        <h1>{activeChat.contato_nome}</h1>
                        <NavLink to="/agentes">
                            <span>Agente - {agentActive?.tipo_de_agente || 'N/A'}</span>
                        </NavLink>
                    </div>
                </div>
                <Menu as="div" className={styles.dropdown}>
                    {({ open }) => (
                        <>
                            <MenuButton className={styles.optionsButton}>
                                <DotsIcon />
                            </MenuButton>

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
                                            <MenuItem>
                                                {({ active }: { active: boolean }) => (
                                                    <button
                                                        onClick={() => {
                                                            setNewName(activeChat?.contato_nome || '');
                                                            setRenameOpen(true);
                                                        }}
                                                        className={active ? styles.activeOption : ''}
                                                    >
                                                        <EditIcon />
                                                        Renomear a conversa.
                                                    </button>
                                                )}
                                            </MenuItem>
                                            <MenuItem>
                                                {({ active }: { active: boolean }) => (
                                                    <button
                                                        onClick={handleDeleteChat}
                                                        className={active ? styles.activeOption : ''}
                                                    >
                                                        <TrashIcon />
                                                        Apagar conversa.
                                                    </button>
                                                )}
                                            </MenuItem>
                                            <MenuItem>
                                                {({ active }: { active: boolean }) => (
                                                    <button
                                                        onClick={() => setDetailsOpen(true)}
                                                        className={active ? styles.activeOption : ''}
                                                    >
                                                        <InfoIcon />
                                                        Dados da conversa.
                                                    </button>
                                                )}
                                            </MenuItem>

                                            <MenuItem>
                                                {({ active }: { active: boolean }) => (
                                                    <button
                                                        onClick={handleToggleChatStatus}
                                                        className={active ? styles.activeOption : ''}
                                                    >
                                                        <>
                                                            {activeChat.status === 'Open' ? (
                                                                <>
                                                                    <XCircleIcon />
                                                                    Fechar conversa.
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <PlayIcon />
                                                                    Reabrir conversa.
                                                                </>
                                                            )}
                                                        </>
                                                    </button>
                                                )}
                                            </MenuItem>



                                        </motion.div>
                                    </MenuItems>
                                )}
                            </AnimatePresence>
                        </>
                    )}
                </Menu>
            </header>

            <Modal transparent={true} isOpen={isDetailsOpen} onClose={() => setDetailsOpen(false)} title="Detalhes do Chat">
                <div className={styles.chatDetails}>

                    <img src={activeChat.foto_perfil || defaultAvatar} alt={`Avatar de ${activeChat.contato_nome}`} />
                    <h2>{activeChat.contato_nome}</h2>
                    <h3>{activeChat.contato_numero}</h3>

                    <div className={styles.bottomDetails}>
                        <NavLink to="/agentes">
                            <p>Agente - {agentActive?.tipo_de_agente || 'N/A'}</p>
                        </NavLink>
                        <strong className={activeChat.ia_ativa ? styles.statusIaActive : styles.statusIaInactive}>{activeChat.ia_ativa ? 'IA Ativa' : 'IA Desativada'}</strong>
                    </div>

                </div>
            </Modal>



            <Modal transparent={true} isOpen={isRenameOpen} onClose={() => setRenameOpen(false)} title="Renomear Chat">
                <div className={styles.inputGroup}>
                    <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Novo nome do contato"
                        className={styles.inputEditChat}
                    />

                    <Button onClick={handleRenameChat} label='Salvar' />
                </div>



            </Modal>

            {isDragging && (
                <div className={styles.dragOverlay}>
                    <div className={styles.overlayContent}>
                        {/* 1. Mensagem de overlay generalizada */}
                        <p>📄 Solte o arquivo para enviar</p>
                    </div>
                </div>
            )}


            <div className={styles.messageList}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}>
                {messages.map((msg) => (
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

            <div className={styles.inputAreaWrapper}>
                {activeChat.status === 'Open' ? <div className={styles.inputArea}>

                    <div
                        className={`${styles.toggleIaButton}`}
                    >
                        <div className={styles.headerToggleIa}>
                            <BotIcon /> {activeChat.ia_ativa ? 'Ativado' : 'Desativado'}
                        </div>
                        <ToggleSwitch variant={'secondary'} isOn={activeChat.ia_ativa ? true : false} onToggle={handleToggleIA} />
                    </div>

                    <ChatInput placeholder="Digite uma mensagem" onSend={handleSendMessage} />

                </div>

                    : (
                        <div className={styles.chatClosedBanner}>
                            <p>Este chat está fechado e não permite novas mensagens.</p>
                            <button onClick={handleToggleChatStatus} className={styles.buttonReOpen}> Esta Conversa Esta Fechada, clique para reabrir</button>

                        </div>
                    )}

            </div>
        </motion.section>
    );
};





