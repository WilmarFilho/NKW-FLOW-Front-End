// Libs
import { useState } from 'react';
import { useRecoilState } from 'recoil';
// Hooks
import useChats from '../../hooks/chats/useChats';
import useMessages from '../../hooks/chats/useMessages';
import useSendMessage from '../../hooks/chats/useSendMessage';
import { useConnections } from '../../hooks/connections/useConnections';
// Recoil
import { userState } from '../../state/atom';
// Type
import { Chat } from '../../types/chats';

export function useConversasPage() {
    // Carregar Dados
    const [user] = useRecoilState(userState);
    const { connections } = useConnections();
    const { chats } = useChats(user?.id);
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
