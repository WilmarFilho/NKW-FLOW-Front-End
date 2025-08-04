import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
// Components
import MessageBubble from '../MessageBubble/MessageBubble';
import ChatInput from '../../Gerais/Inputs/ChatInput';
// Types
import { Chat } from '../../../types/chats';
import { Message } from '../../../types/message';
// Hooks
import useToggleIA from '../../../hooks/chats/useToggleIA';
import useSendMessage from '../../../hooks/chats/useSendMessage';
// Css
import './chatWindow.css'
//Assets
import defaultAvatar from '../assets/default.webp';
import { useAgents } from '../../../hooks/agents/useAgents';
import DotsIcon from '../assets/dots.svg'
import { NavLink } from 'react-router-dom';
import useChats from '../../../hooks/chats/useChats';
import { useRecoilState } from 'recoil';
import { userState } from '../../../state/atom';

import { useSetRecoilState } from 'recoil';
import { chatsState } from '../../../state/atom';

interface Props {
    activeChat: Chat | null;
    messages: Message[];
    setActiveChat: (chat: Chat) => void;
}

const ChatWindow = ({ activeChat, messages, setActiveChat }: Props) => {
    const [user] = useRecoilState(userState);
    const { toggleIA } = useToggleIA();
    const { refetch } = useChats(user?.id);
    const setChats = useSetRecoilState(chatsState);


    const { sendMessage } = useSendMessage();

    const { agents } = useAgents();
    let agentActive = null

    if (activeChat && activeChat.connection) {
        agentActive = agents.find((agent) => agent.id === activeChat?.connection.agente_id);
    }

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (text: string) => {
        if (!activeChat) return;

        const result = await sendMessage({
            chat_id: activeChat.id,
            mensagem: text,
        });

        if (result) {
            const updatedChat = {
                ...activeChat,
                ultima_mensagem: text,
                mensagem_data: '',
            };

            setActiveChat(updatedChat);
            setChats(prev =>
                prev.map(chat =>
                    chat.id === updatedChat.id ? updatedChat : chat
                )
            );
        }
    };

    return (
        <motion.div
            className="right-panel"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
        >

            {activeChat ? (
                <>
                    <div className="wrapper-header-chat">

                        <div className='column-info-header'>
                            <img src={activeChat?.foto_perfil ? activeChat?.foto_perfil : defaultAvatar}></img>
                            <div className='text-header'>
                                <h1>{activeChat?.contato_nome}</h1>
                                <NavLink to={'/agentes'}><span>Agente - {agentActive?.tipo_de_agente}</span></NavLink>
                            </div>
                        </div>

                        <div className='column-icon-header'>
                            <DotsIcon></DotsIcon>
                        </div>



                    </div>
                </>
            ) : (
                ''
            )}


            <div className="messages" style={{ overflowY: 'auto', maxHeight: '100%' }}>
                {activeChat ? (
                    <>
                        {messages.map((msg) => (
                            <MessageBubble
                                key={msg.id}
                                text={msg.mensagem}
                                mimetype={msg.mimetype}
                                base64={msg.base64}
                                sender={msg.remetente === 'cliente' ? 'me' : 'other'}
                            />
                        ))}

                        <div ref={messagesEndRef} /> {/* div invisível para rolar até */}
                    </>
                ) : (
                    <div className='messages-fallback'><p style={{ padding: '1rem' }}>Selecione uma conversa para começar.</p></div>
                )}
            </div>
            <div className="box-chat-input-wrapper">
                <div className="box-chat-input">
                    <ChatInput placeholder="Digite uma mensagem" onSend={handleSendMessage} />

                    {activeChat && (
                        <button
                            onClick={() =>
                                toggleIA(activeChat, (updatedChat) => {
                                    setActiveChat(updatedChat);
                                    refetch();
                                })
                            }
                            className={activeChat.ia_ativa ? 'toggle-ia-btn toggle-ia-active' : 'toggle-ia-btn'}
                        >
                            {activeChat.ia_ativa ? 'Desativar IA' : 'Ativar IA'}
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ChatWindow;


