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

        if (tipo === 'messages.upsert' && message) {
          const chatId = message.chat_id;

          // 1. Atualiza mensagens
          setMessages(prev => {
            const exists = prev.find(m => m.id === message.id);
            return exists ? prev : [...prev, message];
          });

          // 2. Atualiza chats
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

            // Se não existe, apenas retorna prev (SEM fetch aqui)
            return prev;
          });

          // Atualiza chats em tempo real (mantendo ordenação pela última mensagem)
          setChats(prev => {
            const exists = prev.find(c => c.id === chatId);

            let updatedChats;

            if (exists) {
              // Atualiza os dados do chat
              updatedChats = prev.map(chat =>
                chat.id === chatId
                  ? {
                    ...chat,
                    ultima_mensagem: message.mensagem,
                    mensagem_data: message.criado_em,
                  }
                  : chat
              );
            } else {
              // Se ainda não existe, não faz nada aqui
              return prev;
            }

            // Reordena para que o chat atualizado vá para o topo
            return [...updatedChats].sort((a, b) => {
              const dateA = a.mensagem_data ? new Date(a.mensagem_data).getTime() : 0;
              const dateB = b.mensagem_data ? new Date(b.mensagem_data).getTime() : 0;
              return dateB - dateA; // mais recente primeiro
            });
          });


          // 3. Fora do updater, busca o chat no backend e adiciona
          fetch(`${apiConfig.node}/chats/${chatId}`)
            .then(res => res.json())
            .then(chat => {
              setChats(prevChats => {
                const exists = prevChats.find(c => c.id === chatId);
                if (exists) return prevChats; // evita duplicata
                return [...prevChats, {
                  ...chat,
                  ultima_mensagem: message.mensagem,
                  mensagem_data: message.criado_em,
                }];
              });
            })
            .catch(err => {
              console.error('Erro ao buscar chat para a mensagem recebida:', err);
            });
        }

        if (tipo === 'send.message' && message) {
          console.log('📤 Mensagem enviada: send message');

          const chatId = message.chat_id;

          // 1. Atualiza mensagens
          setMessages(prev => {
            const exists = prev.find(m => m.id === message.id);
            return exists ? prev : [...prev, message];
          });

          // 2. Atualiza ou insere chat
          setChats(prev => {
            const exists = prev.find(c => c.id === chatId);
            let updatedChats;

            if (exists) {
              // Atualiza ultima_mensagem e mensagem_data
              updatedChats = prev.map(chat =>
                chat.id === chatId
                  ? {
                    ...chat,
                    ultima_mensagem: message.mensagem,
                    mensagem_data: message.criado_em,
                  }
                  : chat
              );
            } else if (chat) {
              // Caso payload já venha com o chat novo
              updatedChats = [
                ...prev,
                {
                  ...chat,
                  ultima_mensagem: message.mensagem,
                  mensagem_data: message.criado_em,
                },
              ];
            } else {
              // Não tem o chat no estado nem na payload → mantém estado
              return prev;
            }

            // 3. Reordena chats (mais recentes primeiro)
            return [...updatedChats].sort((a, b) => {
              const dateA = a.mensagem_data ? new Date(a.mensagem_data).getTime() : 0;
              const dateB = b.mensagem_data ? new Date(b.mensagem_data).getTime() : 0;
              return dateB - dateA;
            });
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


