// Libs
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
// Hooks
import useChats from '../chats/useChats';
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

    // Estado para controlar se já tentou enviar
    const [showErrors, setShowErrors] = useState(false);

    // Estado para erros específicos do formulário
    const [errors, setErrors] = useState<{
        selectedConnectionId?: string;
        newChatNumber?: string;
        newChatMessage?: string;
    }>({});

    const openNewChatModal = () => {
        setNewChatNumber('');
        setNewChatMessage('');
        setNewChatMessage('');
        setShowErrors(false)
        setIsAddChatOpen(true);
    }

    const validateForm = () => {
        const newErrors: typeof errors = {};

        if (!selectedConnectionId) {
            newErrors.selectedConnectionId = 'Selecione uma conexão.';
        }

        // Exemplo simples para número: deve ser só números e ter 10-15 dígitos
        if (!/^\d{10,15}$/.test(newChatNumber)) {
            newErrors.newChatNumber = 'Número inválido. Use apenas dígitos entre 10 e 15 caracteres.';
        }

        if (!newChatMessage.trim()) {
            newErrors.newChatMessage = 'A mensagem não pode ficar vazia.';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSendMessage = async () => {

        setShowErrors(true);

        if (!validateForm()) return; // impede envio se erros

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
        showErrors,
        errors,
        connections,
        activeChat,
        setActiveChat,
        isAddChatOpen,
        setIsAddChatOpen,
        openNewChatModal,
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