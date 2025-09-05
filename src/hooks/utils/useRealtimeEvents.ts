// Libs
import { useEffect, useState } from 'react';
// Recoil
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  connectionsState,
  chatsState,
  messagesState,
  addConnectionModalState,
  activeChatState,
} from '../../state/atom';
// Config
import { apiConfig } from '../../config/api';
import { Chat } from '../../types/chats';

export const useRealtimeEvents = (userId: string | undefined) => {
  const setConnections = useSetRecoilState(connectionsState);
  const setChats = useSetRecoilState(chatsState);
  const setMessagesByChat = useSetRecoilState(messagesState);
  const setActiveChat = useSetRecoilState<Chat | null>(activeChatState);
  const setModalState = useSetRecoilState(addConnectionModalState);

  useEffect(() => {
    if (!userId) return;

    const eventSource = new EventSource(`${apiConfig.node}/events/${userId}`);

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        console.log('[SSE] Evento recebido:', payload);

        const { event: tipo, connection, message, state, deletedMessage } = payload;

        if (tipo === 'connection.update') {
          if (state === 'close') {
            setConnections((prev) => prev.filter((c) => c.id !== connection.id));
          }
          if (state === 'connecting') {
            setConnections((prev) => {
              const exists = prev.find((c) => c.id === connection.id);
              return exists
                ? prev.map((c) =>
                  c.id === connection.id ? { ...c, state: 'connecting' } : c
                )
                : [...prev, { ...connection, state: 'connecting' }];
            });
          }
          if (state === 'open') {
            setModalState({ isOpen: false });
            setConnections((prev) => {
              const exists = prev.find((c) => c.id === connection.id);
              return exists
                ? prev.map((c) => (c.id === connection.id ? connection : c))
                : [...prev, connection];
            });
          }
        }

        if ((tipo === 'messages.upsert' || tipo === 'send.message') && message) {
          const chatId = message.chat_id;

          // 1. Atualiza apenas mensagens do chat específico
          setMessagesByChat((prev) => {
            const current = prev[chatId] || [];
            const exists = current.find((m) => m.id === message.id);
            return {
              ...prev,
              [chatId]: exists ? current : [...current, message],
            };
          });

          // 2. Sempre busca o chat completo no backend
          fetch(`${apiConfig.node}/chats/${chatId}`)
            .then((res) => res.json())
            .then((chat) => {
              let updatedChats: Chat[] = [];

              // 🔄 Atualiza lista de chats
              setChats((prevChats) => {
                const exists = prevChats.find((c) => c.id === chatId);

                if (exists) {
                  updatedChats = prevChats.map((c) =>
                    c.id === chatId ? { ...c, ...chat } : c
                  );
                } else {
                  updatedChats = [...prevChats, chat];
                }

                return [...updatedChats].sort((a, b) => {
                  const dateA = a.mensagem_data ? new Date(a.mensagem_data).getTime() : 0;
                  const dateB = b.mensagem_data ? new Date(b.mensagem_data).getTime() : 0;
                  return dateB - dateA;
                });
              });

              console.log(chat)

              // ✅ Atualiza o ativo
              setActiveChat((prevActive) =>
                prevActive && prevActive.id === chatId ? chat : prevActive
              );

              // 🔔 Usa `updatedChats` aqui, já com valor garantido
              if (message.remetente === 'Contato') {
                const unreadCount = updatedChats.filter((c) => c.unread_count > 0).length;
                document.title =
                  unreadCount > 0
                    ? `(${unreadCount}) WhatsApp - NKW FLOW`
                    : 'WhatsApp - NKW FLOW';
              }

              if (message.remetente === 'Contato' && chat.ia_ativa === false) {
                const audio = new Audio('/sounds/ding.mp3');
                audio.play().catch((err) =>
                  console.warn('Erro ao tocar notificação', err)
                );
              }
            })
            .catch((err) => {
              console.error('Erro ao buscar chat para a mensagem recebida:', err);
            });

        }

        if (tipo === 'chats.upsert' && payload.chat) {
          const chatId = payload.chat.id;

          setChats((prevChats) => {
            const updatedChats = prevChats.map((c) =>
              c.id === chatId ? { ...c, unread_count: 0 } : c
            );

            // Atualiza o título da aba
            const unreadCount = updatedChats.filter((c) => c.unread_count > 0).length;
            document.title = unreadCount > 0 ? `(${unreadCount}) WhatsApp - NKW FLOW` : 'WhatsApp - NKW FLOW';

            return updatedChats;
          });
        }

        if (tipo === 'messages.delete' && deletedMessage) {
          console.log('🗑️ Recebido evento para excluir mensagem:', deletedMessage);

          const chatId = deletedMessage.chat_id;
          if (!chatId) return;

          setMessagesByChat((prev) => {
            const current = prev[chatId] || [];
            return {
              ...prev,
              [chatId]: current.map((m) =>
                m.id === deletedMessage.id ? { ...m, excluded: true } : m
              ),
            };
          });
        }

      } catch (err) {
        console.error('[SSE] Erro ao processar evento:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn('[SSE] Erro na conexão:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [userId]);
};



