import { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { NavLink } from 'react-router-dom';

// State
import { userState, chatsState } from '../../../state/atom';

// Components
import MessageBubble from '../MessageBubble/MessageBubble';
import ChatInput from '../../Gerais/Inputs/ChatInput';

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

interface ChatWindowProps {
    activeChat: Chat | null;
    messages: Message[];
    setActiveChat: (chat: Chat) => void;
}

export default function ChatWindow({ activeChat, messages, setActiveChat }: ChatWindowProps) {
    const [user] = useRecoilState(userState);
    const setChats = useSetRecoilState(chatsState);
    const { toggleIA } = useToggleIA();
    const { sendMessage } = useSendMessage();
    const { refetch } = useChats(user?.id);
    const { agents } = useAgents();

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
        const result = await sendMessage({ chat_id: activeChat.id, mensagem: text });
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

                <button type="button" className={styles.optionsButton} aria-label="Mais opções">
                    <DotsIcon />
                </button>
            </header>

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