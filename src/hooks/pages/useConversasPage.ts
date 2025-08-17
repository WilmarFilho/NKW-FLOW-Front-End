import { useState, useCallback, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useChats } from '../chats/useChats';
import { useMessages } from '../../hooks/chats/useMessages';
import useSendMessage from '../chats/useMessagesActions';
import useChatActions from '../chats/useChatActions';
import { chatsState, connectionsState, userState } from '../../state/atom';
import type { Chat } from '../../types/chats';
import { Message } from '../../types/message';

export function useConversasPage() {
    const connections = useRecoilValue(connectionsState);
    const chats = useRecoilValue(chatsState);
    const user = useRecoilValue(userState);
    const setChats = useSetRecoilState(chatsState);

    const [replyingTo, setReplyingTo] = useState<Message | undefined>(undefined);
    const [isExiting, setIsExiting] = useState(false);

    const handleCloseReply = () => {
        setIsExiting(true);
    };

    useEffect(() => {

        if (!isExiting) {
            return;
        }

        const timer = setTimeout(() => {
            setReplyingTo(undefined);
            setIsExiting(false);
        }, 50);

        return () => clearTimeout(timer);

    }, [isExiting, setReplyingTo]);

    const { fectchImageProfile } = useChats();
    const { sendMessage } = useSendMessage();
    const { reOpenChat, deleteChat, renameChat, toggleIA } = useChatActions();

    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const { messages } = useMessages(activeChat?.id || null);

    const [isAddChatOpen, setIsAddChatOpen] = useState(false);
    const [newChatNumber, setNewChatNumber] = useState('');
    const [newChatMessage, setNewChatMessage] = useState('');
    const [selectedConnectionId, setSelectedConnectionId] = useState('');
    const [showErrors, setShowErrors] = useState(false);
    const [errors, setErrors] = useState<{ selectedConnectionId?: string; newChatNumber?: string; newChatMessage?: string }>({});

    const openNewChatModal = () => {
        setNewChatNumber('');
        setNewChatMessage('');
        setShowErrors(false);
        setIsAddChatOpen(true);
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (!selectedConnectionId) newErrors.selectedConnectionId = 'Selecione uma conexão.';
        if (!/^\d{10,15}$/.test(newChatNumber)) newErrors.newChatNumber = 'Número inválido.';
        if (!newChatMessage.trim()) newErrors.newChatMessage = 'A mensagem não pode ficar vazia.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendMessage = useCallback(
  async (text?: string, mimetype?: string, base64?: string) => {
    const messageText = text ?? newChatMessage;

    if (!activeChat) {
      setShowErrors(true);

      if (!validateForm()) return;

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

      return;
    }

    // Mensagem em chat existente
    const result = await sendMessage({
      chat_id: activeChat.id,
      mensagem: messageText,
      user_id: user?.id,
      mimetype,
      base64,
      quote_id: replyingTo?.id || undefined,
    });

    if (result) {
      // 🚀 Se estava respondendo, anima antes de limpar
      if (replyingTo) {
        setIsExiting(true);
        setTimeout(() => {
          setReplyingTo(undefined);
          setIsExiting(false);
        }, 900);
      }

      const lastMessageText =
        messageText ||
        (mimetype?.startsWith('image/')
          ? '📷 Imagem'
          : mimetype?.startsWith('audio/')
          ? '🎙️ Áudio'
          : '📄 Documento');

      const updatedChat = { ...activeChat, ultima_mensagem: lastMessageText };

      setActiveChat(updatedChat);
      setChats((prev) =>
        prev.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
      );
    }
  },
  [
    activeChat,
    newChatMessage,
    newChatNumber,
    selectedConnectionId,
    sendMessage,
    setChats,
    user?.id,
    replyingTo,
  ]
);

    const handleToggleIA = useCallback(async () => {
        if (!activeChat) return;
        const updatedIaStatus = await toggleIA(activeChat.id, activeChat.ia_ativa);

        if (typeof updatedIaStatus === 'boolean') {
            const updatedChat: Chat = { ...activeChat, ia_ativa: updatedIaStatus };
            setActiveChat(updatedChat);
            setChats((prev: Chat[]) =>
                prev.map((chat: Chat) => (chat.id === updatedChat.id ? updatedChat : chat))
            );
        }
    }, [activeChat, toggleIA, setChats]);

    const handleDeleteChat = useCallback(async () => {
        if (!activeChat) return;
        if (window.confirm('Tem certeza?')) {
            await deleteChat(activeChat.id);
            setActiveChat(null);
        }
    }, [activeChat, deleteChat]);

    const handleToggleChatStatus = useCallback(async () => {
        if (!activeChat) return;
        const newStatus = activeChat.status === 'Open' ? 'Close' : 'Open';
        const result = await reOpenChat(activeChat.id, newStatus);
        if (result) {
            const updatedChat = { ...activeChat, status: newStatus };
            setActiveChat(updatedChat);
            setChats(prev => prev.map(chat => (chat.id === updatedChat.id ? updatedChat : chat)));
        }
    }, [activeChat, reOpenChat, setChats]);

    const handleRenameChat = useCallback((newName: string) => {
        if (!activeChat || !newName.trim()) return;
        renameChat(activeChat.id, newName.trim());
        setActiveChat({ ...activeChat, contato_nome: newName.trim() });
    }, [activeChat, renameChat]);

    const handleFileDrop = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            const messageText = file.type.startsWith('image/') ? '' : file.name;
            handleSendMessage(messageText, file.type, base64);
        };
        reader.readAsDataURL(file);
    }, [handleSendMessage]);

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
        handleToggleIA,
        handleDeleteChat,
        handleToggleChatStatus,
        handleRenameChat,
        handleFileDrop,
        setReplyingTo,
        replyingTo,
        setIsExiting,
        isExiting,
        handleCloseReply
    };
}