import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { connectionsState, chatsState, messagesState } from '../../state/atom';
import { apiConfig } from '../../config/api';
import { addConnectionModalState } from '../../state/atom';


export const useRealtimeEvents = (userId: string) => {
  const setConnections = useSetRecoilState(connectionsState);
  const setChats = useSetRecoilState(chatsState);
  const setMessages = useSetRecoilState(messagesState);
  const setModalState = useSetRecoilState(addConnectionModalState);

  useEffect(() => {
    if (!userId) return;

    const eventSource = new EventSource(`${apiConfig.node}/events/${userId}`);
    console.log(`[SSE] Conectado ao /events/${userId}`);

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const { event: tipo, connection, chat, message, state } = payload;

        console.log(payload, chat)

        if (tipo === 'connection.update') {
          if (state === 'close') {
            setConnections(prev => prev.filter(c => c.id !== connection.id));
          } else {
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
          console.log('📥 Nova mensagem recebida');

          if (message) {
            const chatId = message.chat_id;

            setChats(prev => {
              const exists = prev.find(c => c.id === chatId);
              if (exists) return prev;

              // Buscar o chat do backend
              fetch(`${apiConfig.node}/chats/${chatId}`)
                .then(res => res.json())
                .then(chat => {
                  setChats(prevChats => [...prevChats, chat]);
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
          console.log('📤 Mensagem enviada');
          if (message) {
            setMessages(prev => {
              const exists = prev.find(m => m.id === message.id);
              return exists ? prev : [...prev, message];
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
      console.log('[SSE] Conexão encerrada');
    };
  }, [userId]);
};
