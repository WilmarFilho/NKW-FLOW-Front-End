// Libs
import { useEffect } from 'react';
// Recoil
import { useSetRecoilState } from 'recoil';
import { connectionsState, chatsState, messagesState, addConnectionModalState } from '../../state/atom';
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
  
        const { event: tipo, connection, chat, message, state } = payload;

        if (tipo === 'connection.update') {
          if (state === 'close') {
            setConnections(prev => prev.filter(c => c.id !== connection.id));
          } if (state === 'open') {
            setModalState({ isOpen: false });

            setConnections(prev => {
              const exists = prev.find(c => c.id === connection.id);
              return exists
                ? prev.map(c => (c.id === connection.id ? connection : c))
                : [...prev, connection];
            });
          }
        }

        if (tipo === 'messages.upsert') {
          console.log('📥 Nova mensagem recebida : messages.upsert');

          if (message) {
            const chatId = message.chat_id;

            setChats(prev => {
              const exists = prev.find(c => c.id === chatId);

              if (exists) {
                return prev.map(chat =>
                  chat.id === chatId
                    ? {
                      ...chat,
                      ultima_mensagem: message.mensagem,
                      mensagem_data: message.criado_em,
                    }
                    : chat
                );
              }

              // Se o chat ainda não está carregado, busca ele do backend
              fetch(`${apiConfig.node}/chats/${chatId}`)
                .then(res => res.json())
                .then(chat => {
                  setChats(prevChats => [...prevChats, {
                    ...chat,
                    ultima_mensagem: message.mensagem,
                    mensagem_data: message.criado_em,
                  }]);
                })
                .catch(err => {
                  console.error('Erro ao buscar chat para a mensagem recebida:', err);
                });

              return prev;
            });


            setMessages(prev => {
              const exists = prev.find(m => m.id === message.id);
              return exists ? prev : [...prev, message];
            });
          }
        }

        if (tipo === 'send.message') {
          console.log('📤 Mensagem enviada: send message');

          if (message) {
            const chatId = message.chat_id;

            setMessages(prev => {
              const exists = prev.find(m => m.id === message.id);
              return exists ? prev : [...prev, message];
            });

            setChats(prev => {
              const exists = prev.find(c => c.id === chatId);

              if (exists) {
                return prev.map(chat =>
                  chat.id === chatId
                    ? {
                      ...chat,
                      ultima_mensagem: message.mensagem,
                      mensagem_data: message.criado_em,
                    }
                    : chat
                );
              }

              // Novo chat recebido via evento
              if (chat) {
                return [...prev, {
                  ...chat,
                  ultima_mensagem: message.mensagem,
                  mensagem_data: message.criado_em,
                }];
              }

              return prev;
            });
          }
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