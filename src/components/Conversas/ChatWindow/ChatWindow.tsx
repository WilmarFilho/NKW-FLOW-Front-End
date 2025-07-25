// Utils
import { motion } from 'framer-motion';
// Components
import MessageBubble from '../MessageBubble/MessageBubble';
import ChatInput from '../../Gerais/Inputs/ChatInput';
// Types
import { Chat } from '../../../types/chats';
import { Message } from '../../../types/message';
// Hooks
import useToggleIA from '../../../hooks/useToggleIA';

interface Props {
    activeChat: Chat | null;
    messages: Message[];
    setActiveChat: (chat: Chat) => void;
    onSendMessage: (text: string) => void;
}

const ChatWindow = ({ activeChat, messages, setActiveChat, onSendMessage }: Props) => {

    const { toggleIA } = useToggleIA();

    return (
        <motion.div
            className="right-panel"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
        >
            <div className="messages">
                {activeChat ? (
                    messages.map((msg, index) => (
                        <MessageBubble
                            key={index}
                            text={msg.mensagem}
                            sender={msg.remetente === 'cliente' ? 'me' : 'other'}
                        />
                    ))
                ) : (
                    <p style={{ padding: '1rem' }}>Selecione uma conversa</p>
                )}
            </div>

            <div className="box-chat-input">
                <ChatInput placeholder="Digite uma mensagem" onSend={onSendMessage} />

                {activeChat && (
                    <button
                        onClick={() => toggleIA(activeChat, setActiveChat)}
                        className="toggle-ia-btn"
                    >
                        {activeChat.ia_ativa ? 'Desativar IA' : 'Ativar IA'}
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default ChatWindow;
