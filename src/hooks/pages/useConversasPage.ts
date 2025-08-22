import { useState, useCallback, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useChats } from '../chats/useChats';
import { useMessages } from '../../hooks/chats/useMessages';
import useMessagesActions from '../chats/useMessagesActions';
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
  const { sendMessage, deleteMessage } = useMessagesActions();

  const { reOpenChat, deleteChat, renameChat, toggleIA, claimChatOwner, releaseChatOwner } = useChatActions();

  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const { messages, fetchMoreMessages, hasMore, isLoading } = useMessages(activeChat?.id || null);

  const handleReleaseChatOwner = useCallback(async () => {

    if (!activeChat) return;
   
    if (!activeChat.user_id) return;

    const updated = await releaseChatOwner(activeChat.id);

    if (updated) {

      setActiveChat(prev => (prev ? { ...prev, user_id: null } : prev));

    }
  }, [activeChat, releaseChatOwner, setActiveChat]);


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

  const validateForm = useCallback(() => {
    const newErrors: typeof errors = {};
    if (!selectedConnectionId) newErrors.selectedConnectionId = 'Selecione uma conexão.';
    if (!/^\d{10,15}$/.test(newChatNumber)) newErrors.newChatNumber = 'Número inválido.';
    if (!newChatMessage.trim()) newErrors.newChatMessage = 'A mensagem não pode ficar vazia.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [selectedConnectionId, newChatNumber, newChatMessage]);

  const handleSendMessage = useCallback(
    async (text?: string, mimetype?: string, base64?: string) => {
      const messageText = text ?? newChatMessage;

      // CASO: criando um chat novo do zero
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

      // 1. Bloqueio se IA ativa
      if (activeChat.ia_ativa) {
        alert('⚠️ Não é possível enviar mensagem enquanto a IA está ativa.');
        return;
      }

      const cooldownMin = 2;

      if (activeChat.ia_desligada_em) {
        let iso = activeChat.ia_desligada_em;

        if (!iso.endsWith('Z') && !iso.includes('+')) {
          iso += 'Z';
        }

        const desligadaEm = new Date(iso);
        const desligadaMs = desligadaEm.getTime();
        const agoraMs = Date.now();
        const diff = agoraMs - desligadaMs;

        if (diff < cooldownMin * 60 * 1000) {
          alert('⚠️ Aguarde alguns minutos antes de assumir o chat após desligar a IA.');
          return;
        }
      }



      // 3. Envia mensagem
      const result = await sendMessage({
        chat_id: activeChat.id,
        mensagem: messageText,
        user_id: user?.id,
        mimetype,
        base64,
        quote_id: replyingTo?.id || undefined,
      });

      if (result) {

        if (!activeChat.user_id && user?.id) {

          await claimChatOwner(activeChat.id, user.id);

          setActiveChat(prev => (prev ? { ...prev, user_id: user.id } : prev));

        }

        if (replyingTo) {
          setIsExiting(true);
          setTimeout(() => {
            setReplyingTo(undefined);
            setIsExiting(false);
          }, 900);
        }
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
      validateForm,
    ]
  );

  const handleToggleIA = useCallback(async () => {
    if (!activeChat) return;

    const updated = await toggleIA(activeChat.id, activeChat.ia_ativa);
    if (updated) {
      // sincroniza o chat ativo
      setActiveChat(prev =>
        prev
          ? {
            ...prev,
            ia_ativa: updated.ia_ativa,
            ia_desligada_em: updated.ia_desligada_em,
            user_id: updated.user_id ?? prev.user_id, // atualiza o user_id local
          }
          : prev
      );

      // sincroniza a lista de chats
      setChats(prev =>
        prev.map(c =>
          c.id === updated.id
            ? {
              ...c,
              ia_ativa: updated.ia_ativa,
              ia_desligada_em: updated.ia_desligada_em,
              user_id: updated.user_id
            }
            : c
        )
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

    const currentUserId = user?.id;
    const newStatus = activeChat.status === 'Open' ? 'Close' : 'Open';

    // Regras para fechar chat
    if (
      newStatus === 'Close' &&
      (activeChat.ia_ativa || !activeChat.user_id || activeChat.user_id !== currentUserId)
    ) {
      let message = 'Não é possível fechar este chat devido a:';

      if (activeChat.ia_ativa) message += '\n- A IA ainda está ativa';

      if (!activeChat.user_id) {
        message += '\n- Nenhum atendente assumiu a conversa';
      } else if (activeChat.user_id !== currentUserId) {
        message += '\n- Outro atendente está assumindo essa conversa';
      }

      alert(message); // ou toast
      return;
    }

    const result = await reOpenChat(activeChat.id, newStatus);
    if (result) {
      const updatedChat = { ...activeChat, status: newStatus };
      setActiveChat(updatedChat);
      setChats(prev => prev.map(chat => (chat.id === updatedChat.id ? updatedChat : chat)));
    }
  }, [activeChat, reOpenChat, setChats, user?.id]);



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
    handleCloseReply,
    handleDeleteMessage: deleteMessage,
    fetchMoreMessages,
    hasMore,
    isLoading,
    handleReleaseChatOwner
  };
}








