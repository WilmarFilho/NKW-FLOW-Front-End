import { useEffect, useRef, useMemo, useState } from 'react';
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

// Assets & CSS
import defaultAvatar from '../assets/default.webp';
import DotsIcon from '../assets/dots.svg';
import styles from './ChatWindow.module.css';
import Button from '../../../components/Gerais/Buttons/Button';

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
    const { refetch } = useChats(user?.id);
    const { agents } = useAgents();

    const [isRenameOpen, setRenameOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const { deleteChat, renameChat } = useChats(user?.id);

    const handleDeleteChat = async () => {
        if (window.confirm('Tem certeza?')) {
            if (!activeChat) return;
            await deleteChat(activeChat.id);
            setActiveChat(null);
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

    const handleSendMessage = async (text: string) => {
        if (!activeChat) return;
        const result = await sendMessage({ chat_id: activeChat.id, mensagem: text, user_id: user?.id });
        if (result) {
            const updatedChat = { ...activeChat, ultima_mensagem: text };
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

    return (
        <motion.section
            className={styles.chatWindow}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
        >
            <header className={styles.chatHeader}>
                <div className={styles.contactInfo}>
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
                                                        Editar Chat
                                                    </button>
                                                )}
                                            </MenuItem>
                                            <MenuItem>
                                                {({ active }: { active: boolean }) => (
                                                    <button
                                                        onClick={handleDeleteChat}
                                                        className={active ? styles.activeOption : ''}
                                                    >
                                                        Deletar Chat
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

            <Modal isOpen={isRenameOpen} onClose={() => setRenameOpen(false)} title="Renomear Chat">
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

            <div className={styles.messageList}>
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
                <div className={styles.inputArea}>
                    <ChatInput placeholder="Digite uma mensagem" onSend={handleSendMessage} />
                    <button
                        type="button"
                        onClick={handleToggleIA}
                        className={`${styles.toggleIaButton} ${activeChat.ia_ativa ? styles.active : ''}`}
                    >
                        {activeChat.ia_ativa ? 'Desativar IA' : 'Ativar IA'}
                    </button>
                </div>
            </div>
        </motion.section>
    );
};



