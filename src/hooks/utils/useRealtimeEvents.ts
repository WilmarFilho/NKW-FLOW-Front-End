import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  connectionsState,
  chatsState,
  messagesState,
  addConnectionModalState,
  activeChatState,
  chatFiltersState,
} from '../../state/atom';
import { apiConfig } from '../../config/api';
import { Chat, ChatFilters } from '../../types/chats';


// ✨ Função auxiliar para verificar se um chat corresponde aos filtros
const chatMatchesFilters = (chat: Chat, filters: ChatFilters, userId: string | undefined): boolean => {
  if (!userId) return false;

  if (filters.search && filters.search.trim() !== '') {
    // Convertemos o termo de busca para minúsculas para busca case-insensitive.
    const searchTerm = filters.search.trim().toLowerCase();

    // Pegamos o nome e o número do chat de forma segura (caso sejam null/undefined)
    // e também os convertemos para minúsculas.
    const chatName = chat.contato_nome?.toLowerCase() || '';
    const chatNumber = chat.contato_numero?.toLowerCase() || '';

    // Verificamos se o nome OU o número contêm o termo de busca.
    const nameMatches = chatName.includes(searchTerm);
    const numberMatches = chatNumber.includes(searchTerm);

    // Se NENHUM dos dois corresponder, o chat não passa no filtro.
    if (!nameMatches && !numberMatches) {
      return false;
    }
  }

  // Filtro de Status (Open/Close)
  if (filters.status && chat.status !== filters.status) return false;

  // Filtro de IA
  if (filters.iaStatus === 'ativa' && !chat.ia_ativa) return false;
  if (filters.iaStatus === 'desativada' && chat.ia_ativa) return false;

  // Filtro de Dono (Meus Chats)
  if (filters.owner === 'mine' && chat.user_id !== userId) return false;

  // Filtro de Conexão
  if (filters.connection_id && chat.connection_id !== filters.connection_id) return false;

  // Filtro de Atendente
  if (filters.attendant_id && chat.user_id !== filters.attendant_id) return false;

  // Se passou em todos os testes, o chat é válido para os filtros atuais
  return true;
};

export const useRealtimeEvents = (userId: string | undefined, token: string) => {

  const setConnections = useSetRecoilState(connectionsState);;
  const setModalState = useSetRecoilState(addConnectionModalState);
  const setChats = useSetRecoilState(chatsState);
  const setMessagesByChat = useSetRecoilState(messagesState);
  const filters = useRecoilValue(chatFiltersState);
  const [activeChat, setActiveChat] = useRecoilState(activeChatState);

  useEffect(() => {
    if (!userId) return;

    const eventSource = new EventSource(
      `${apiConfig.node}/events/${userId}?token=${encodeURIComponent(token)}`
    );

    console.log(apiConfig.node);

    const parseDateBR = (d?: string | null) => {
      if (!d) return 0;
      let iso = d.replace(' ', 'T').replace(/(\.\d{3})\d+/, '$1');
      if (!iso.endsWith('Z') && !iso.includes('+')) iso += 'Z'; // garante UTC
      return new Date(iso).getTime();
    };

    eventSource.onmessage = (event) => {
      try {

        const payload = JSON.parse(event.data);

        console.log('[SSE] Evento recebido:', payload);

        const { event: tipo, connection, message, state, deletedMessage, error } = payload;

        // ======= CONNECTION ERRORS =======
        if (error && message === 'Conexao duplicada') {

          toast.error('Este número já está conectado.');
          setModalState((prev) => ({ ...prev, isOpen: false, step: 1, qrCode: null, isLoading: false }));

          // Remove localmente conexões com status null
          setConnections((prev) =>
            prev.filter((conn) => conn.status !== null)
          );

          return;
        }

        // ======= CONNECTION EVENTS =======

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
            setModalState((prev) => ({ ...prev, isOpen: false, step: 1 }));
            setConnections((prev) => {
              const exists = prev.find((c) => c.id === connection.id);
              return exists
                ? prev.map((c) => (c.id === connection.id ? connection : c))
                : [...prev, connection];
            });
          }
        }

        // ======= MESSAGES EVENTS =======
        if ((tipo === 'messages.upsert' || tipo === 'send.message') && message) {
          const chatId = message.chat_id;

          // 1️⃣ Atualiza mensagens do chat
          setMessagesByChat((prev) => {
            const current = prev[chatId] || [];
            const exists = current.find((m) => m.id === message.id);
            return {
              ...prev,
              [chatId]: exists ? current : [...current, message],
            };
          });



          if (activeChat?.id === chatId) {
            console.log('Scroll to bottom for chat:', chatId);
            requestAnimationFrame(() => {
              const list = document.querySelector(`#chat-list-${chatId}`) as HTMLDivElement;
              console.log('List element:', list);
              if (list) list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
            });
          }

          // 2️⃣ Atualiza chat completo no frontend
          fetch(`${apiConfig.node}/chats/${chatId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,  // token do login
              'x-auth-id': userId                  // auth_id do Supabase
            }
          })
            .then((res) => res.json())
            .then((fullChatData: Chat) => {
              // Verifica se o chat atualizado passa nos filtros atuais
              const shouldBeVisible = chatMatchesFilters(fullChatData, filters, userId);

              setChats((prevChats) => {
                const chatExistsInList = prevChats.some((c) => c.id === chatId);
                let newChats: Chat[];

                if (shouldBeVisible) {
                  // Se deve ser visível: adicione ou atualize
                  const updatedChat = {
                    ...fullChatData,
                    mensagem_data: message.created_at || fullChatData.mensagem_data,
                  };

                  if (chatExistsInList) {
                    newChats = prevChats.map((c) => c.id === chatId ? updatedChat : c);
                  } else {
                    newChats = [...prevChats, updatedChat];
                  }
                } else {
                  // Se NÃO deve ser visível: remova da lista se existir
                  newChats = prevChats.filter((c) => c.id !== chatId);
                }

                if (message.remetente === 'Contato') {
                  const unreadCount = newChats.filter((c) => c.unread_count > 0).length;
                  document.title =
                    unreadCount > 0
                      ? `(${unreadCount}) WhatsApp - NKW FLOW`
                      : 'WhatsApp - NKW FLOW';
                }

                // Sempre reordene a lista final
                return newChats.sort(
                  (a, b) => parseDateBR(b.mensagem_data) - parseDateBR(a.mensagem_data)
                );
              });

              // atualiza chat ativo se for o mesmo
              setActiveChat((prevActive) =>
                prevActive && prevActive.id === chatId ? fullChatData : prevActive
              );

              // ✨ CORREÇÃO 2: Usar a variável correta `fullChatData`.
              if (message.remetente === 'Contato' && fullChatData.ia_ativa === false) {
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

        // ======= CHAT UPDATES =======
        if (tipo === 'chats.upsert' && payload.chat) {
          const chatId = payload.chat.id;
          setChats((prevChats) => {
            const updatedChats = prevChats.map((c) =>
              c.id === chatId ? { ...c, unread_count: 0 } : c
            );

            const unreadCount = updatedChats.filter((c) => c.unread_count > 0).length;
            document.title =
              unreadCount > 0 ? `(${unreadCount}) WhatsApp - NKW FLOW` : 'WhatsApp - NKW FLOW';

            return updatedChats;
          });
        }

        // ======= MESSAGES DELETE =======
        if (tipo === 'messages.delete' && deletedMessage) {
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
      console.log('[SSE] Erro na conexão:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [userId]);
};