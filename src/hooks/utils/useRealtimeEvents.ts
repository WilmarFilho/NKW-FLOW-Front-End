import { useEffect, useRef, useCallback } from 'react';
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

const chatMatchesFilters = (chat: Chat, filters: ChatFilters, userId: string | undefined): boolean => {
  if (!userId) return false;

  if (filters.search && filters.search.trim() !== '') {
    const searchTerm = filters.search.trim().toLowerCase();
    const chatName = chat.contato_nome?.toLowerCase() || '';
    const chatNumber = chat.contato_numero?.toLowerCase() || '';
    const nameMatches = chatName.includes(searchTerm);
    const numberMatches = chatNumber.includes(searchTerm);
    if (!nameMatches && !numberMatches) {
      return false;
    }
  }

  if (filters.status && chat.status !== filters.status) return false;
  if (filters.iaStatus === 'ativa' && !chat.ia_ativa) return false;
  if (filters.iaStatus === 'desativada' && chat.ia_ativa) return false;
  if (filters.owner === 'mine' && chat.user_id !== userId) return false;
  if (filters.connection_id && chat.connection_id !== filters.connection_id) return false;
  if (filters.attendant_id && chat.user_id !== filters.attendant_id) return false;

  return true;
};

export const useRealtimeEvents = (userId: string | undefined, token: string) => {
  const setConnections = useSetRecoilState(connectionsState);
  const setModalState = useSetRecoilState(addConnectionModalState);
  const setChats = useSetRecoilState(chatsState);
  const setMessagesByChat = useSetRecoilState(messagesState);
  const filters = useRecoilValue(chatFiltersState);
  const [activeChat, setActiveChat] = useRecoilState(activeChatState);

  const eventSourceRef = useRef<EventSource | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<number>(0);

  // Heartbeat para detectar SSE morto
  const lastPingRef = useRef<number>(Date.now());

  // Usamos refs para acessar os valores mais recentes sem causar recriação do useCallback
  const filtersRef = useRef(filters);
  const activeChatRef = useRef(activeChat);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  const connect = useCallback(() => {
    if (!userId || !token) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    const newEventSource = new EventSource(
      `${apiConfig.node}/events/${userId}?token=${encodeURIComponent(token)}`
    );
    eventSourceRef.current = newEventSource;

    newEventSource.onopen = () => {
      retryCountRef.current = 0;
      lastPingRef.current = Date.now();
    };

    const parseDateBR = (d?: string | null) => {
      if (!d) return 0;
      let iso = d.replace(' ', 'T').replace(/(\.\d{3})\d+/, '$1');
      if (!iso.endsWith('Z') && !iso.includes('+')) iso += 'Z';
      return new Date(iso).getTime();
    };

    newEventSource.addEventListener('ping', () => {
      lastPingRef.current = Date.now();
    });

    newEventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const { event: tipo, connection, message, state, deletedMessage, error } = payload;

        if (error && message === 'Conexao duplicada') {
          toast.error('Este número já está conectado.');
          setModalState((prev) => ({ ...prev, isOpen: false, step: 1, qrCode: null, isLoading: false }));
          setConnections((prev) => (prev ?? []).filter((conn) => conn.status !== null));
          return;
        }

        if (tipo === 'connection.update') {
          if (state === 'close') {
            setConnections((prev) => (prev ?? []).filter((c) => c.id !== connection.id));
          }
          if (state === 'connecting') {
            setConnections((prev) => {
              const safePrev = prev ?? [];
              const exists = safePrev.find((c) => c.id === connection.id);
              return exists
                ? safePrev.map((c) => (c.id === connection.id ? { ...c, state: 'connecting' } : c))
                : [...safePrev, { ...connection, state: 'connecting' }];
            });
          }
          if (state === 'open') {
            setModalState((prev) => ({ ...prev, isOpen: false, step: 1 }));
            setConnections((prev) => {
              const safePrev = prev ?? [];
              const exists = safePrev.find((c) => c.id === connection.id);
              return exists
                ? safePrev.map((c) => (c.id === connection.id ? connection : c))
                : [...safePrev, connection];
            });
          }
        }

        if ((tipo === 'messages.upsert' || tipo === 'send.message') && message) {
          const chatId = message.chat_id;

          setMessagesByChat((prev) => {
            const safePrev = prev ?? {};
            const current = safePrev[chatId] || [];
            const exists = current.find((m) => m.id === message.id);
            return {
              ...prev,
              [chatId]: exists ? current : [...current, message],
            };
          });

          if (activeChatRef.current?.id === chatId) {
            requestAnimationFrame(() => {
              const list = document.querySelector(`#chat-list-${chatId}`) as HTMLDivElement;
              if (list) list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
            });
          }

          fetch(`${apiConfig.node}/chats/${chatId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'x-auth-id': userId,
            },
          })
            .then((res) => res.json())
            .then((fullChatData: Chat) => {
              const shouldBeVisible = chatMatchesFilters(fullChatData, filtersRef.current, userId);

              setChats((prevChats) => {
                const chatExistsInList = (prevChats ?? []).some((c) => c.id === chatId);
                let newChats: Chat[];

                if (shouldBeVisible) {
                  const updatedChat = { ...fullChatData, mensagem_data: message.created_at || fullChatData.mensagem_data };
                  const safePrevChats = prevChats ?? [];
                  newChats = chatExistsInList
                    ? safePrevChats.map((c) => (c.id === chatId ? updatedChat : c))
                    : [...safePrevChats, updatedChat];
                } else {
                  const safePrevChats = prevChats ?? [];
                  newChats = safePrevChats.filter((c) => c.id !== chatId);
                }

                if (message.remetente === 'Contato') {
                  const unreadCount = newChats.filter((c) => c.unread_count > 0).length;
                  document.title = unreadCount > 0 ? `(${unreadCount}) WhatsApp - NKW FLOW` : 'WhatsApp - NKW FLOW';
                }

                return newChats.sort((a, b) => parseDateBR(b.mensagem_data) - parseDateBR(a.mensagem_data));
              });

              setActiveChat((prevActive) => (prevActive && prevActive.id === chatId ? fullChatData : prevActive));

              if (message.remetente === 'Contato' && fullChatData.ia_ativa === false) {
                const audio = new Audio('/sounds/ding.mp3');
                audio.play().catch(() => {
                  // Silencia o erro sem logar nada
                });
              }
            })
            
        }

        if (tipo === 'chats.upsert' && payload.chat) {
          const chatId = payload.chat.id;
          setChats((prevChats) => {
            const safePrevChats = prevChats ?? [];
            const updatedChats = safePrevChats.map((c) => (c.id === chatId ? { ...c, unread_count: 0 } : c));
            const unreadCount = updatedChats.filter((c) => c.unread_count > 0).length;
            document.title = unreadCount > 0 ? `(${unreadCount}) WhatsApp - NKW FLOW` : 'WhatsApp - NKW FLOW';
            return updatedChats;
          });
        }

        if (tipo === 'messages.delete' && deletedMessage) {
          const chatId = deletedMessage.chat_id;
          if (!chatId) return;

          setMessagesByChat((prev) => {
            const safePrev = prev ?? {};
            const current = safePrev[chatId] || [];
            return {
              ...safePrev,
              [chatId]: current.map((m) => (m.id === deletedMessage.id ? { ...m, excluded: true } : m)),
            };
          });
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        // 
      }
    };

    newEventSource.onerror = () => {
      newEventSource.close();

      const retryCount = retryCountRef.current;
      const delay = Math.min(60000, 2000 * Math.pow(2, retryCount));

      retryTimeoutRef.current = setTimeout(() => {
        retryCountRef.current += 1;
        connect();
      }, delay);
    };
  }, [userId, token, setConnections, setModalState, setChats, setMessagesByChat, setActiveChat]);

  useEffect(() => {
    connect();

    // reconecta quando a internet volta
    const handleOnline = () => {
      retryCountRef.current = 0;
      connect();
    };

    // reconecta quando volta para a aba/tela
    const handleFocus = () => {
      if (!eventSourceRef.current || eventSourceRef.current.readyState === EventSource.CLOSED) {
        retryCountRef.current = 0;
        connect();
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    // watchdog do ping
    const watchdog = setInterval(() => {
      if (Date.now() - lastPingRef.current > 30000) {
        connect();
      }
    }, 10000);

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
      clearInterval(watchdog);
    };
  }, [connect]);
};
