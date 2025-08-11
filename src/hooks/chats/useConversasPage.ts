// Libs
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
// Hooks
import useChats from './useChats';
import useMessages from '../../hooks/chats/useMessages';
import useSendMessage from '../../hooks/chats/useSendMessage';
// Recoil
import { chatsState, connectionsState } from '../../state/atom';
// Type
import { Chat } from '../../types/chats';

export function useConversasPage() {

    // Carregar Dados
    const connections = useRecoilValue(connectionsState);
    const chats = useRecoilValue(chatsState)
    const { fectchImageProfile } = useChats();
    
    // Carregar Hooks
    const { sendMessage } = useSendMessage();
    // Carrega Mensagens do Chat Ativo
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const { messages } = useMessages(activeChat?.id || null);
    // Modal para Começar Chat (VEJO MELHORIAS)
    const [isAddChatOpen, setIsAddChatOpen] = useState(false);
    const [newChatNumber, setNewChatNumber] = useState('');
    const [newChatMessage, setNewChatMessage] = useState('');
    const [selectedConnectionId, setSelectedConnectionId] = useState('');

    const handleSendMessage = async () => {
        const result = await sendMessage({
            mensagem: newChatMessage,
            number: newChatNumber,
            connection_id: selectedConnectionId,
        });

        if (result) {
            setIsAddChatOpen(false);
            setNewChatNumber('');
            setNewChatMessage('');
            setSelectedConnectionId('');
        }
    };

    return {
        chats,
        fectchImageProfile,
        connections,
        activeChat,
        setActiveChat,
        isAddChatOpen,
        setIsAddChatOpen,
        newChatNumber,
        setNewChatNumber,
        newChatMessage,
        setNewChatMessage,
        selectedConnectionId,
        setSelectedConnectionId,
        handleSendMessage,
        messages,
    };
}