// Libs
import { useEffect } from 'react';
// Recoil
import { useSetRecoilState } from 'recoil';
import {
  connectionsState,
  chatsState,
  messagesState,
  addConnectionModalState,
} from '../../state/atom';
// Config
import { apiConfig } from '../../config/api';

export const useRealtimeEvents = (userId: string | undefined) => {
  const setConnections = useSetRecoilState(connectionsState);
  const setChats = useSetRecoilState(chatsState);
  const setMessages = useSetRecoilState(messagesState);
  const setModalState = useSetRecoilState(addConnectionModalState);

  useEffect(() => {
    if (!userId) return;

    const eventSource = new EventSource(`${apiConfig.node}/events/${userId}`);

    eventSource.onmessage = (event) => {
      try {

        const payload = JSON.parse(event.data);

        const { event: tipo, connection, message, state, deletedMessage } = payload;

        if (tipo === 'connection.update') {
          if (state === 'close') {
            setConnections((prev) => prev.filter((c) => c.id !== connection.id));
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

          // 1. Atualiza apenas mensagens no estado
          setMessages((prev) => {
            const exists = prev.find((m) => m.id === message.id);
            return exists ? prev : [...prev, message];
          });

          // 2. Sempre busca o chat completo no backend
          fetch(`${apiConfig.node}/chats/${chatId}`)
            .then((res) => res.json())
            .then((chat) => {
              setChats((prevChats) => {
                const exists = prevChats.find((c) => c.id === chatId);
                let updatedChats;

                if (exists) {
                  updatedChats = prevChats.map((c) =>
                    c.id === chatId ? { ...c, ...chat } : c
                  );
                } else {
                  updatedChats = [...prevChats, chat];
                }

                if (message.remetente === 'Contato') {
                  const unreadCount = updatedChats.filter((c) => c.unread_count > 0).length;
                  console.log(unreadCount)
                  document.title = unreadCount > 0 ? `(${unreadCount}) WhatsApp - NKW FLOW` : 'WhatsApp - NKW FLOW';
                }

                const sorted = [...updatedChats].sort((a, b) => {
                  const dateA = a.mensagem_data
                    ? new Date(a.mensagem_data).getTime()
                    : 0;
                  const dateB = b.mensagem_data
                    ? new Date(b.mensagem_data).getTime()
                    : 0;
                  return dateB - dateA;
                });

                return sorted;
              });
            })
            .catch((err) => {
              console.error(
                'Erro ao buscar chat para a mensagem recebida:',
                err
              );
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

          console.log(`🗑️ Recebido evento para excluir mensagem: ${deletedMessage}`);

          console.log(deletedMessage)

          setMessages((prevMessages) =>
            prevMessages.map((m) =>
              m.id === deletedMessage.id
                ? { ...m, excluded: true }
                : m
            )
          );
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


