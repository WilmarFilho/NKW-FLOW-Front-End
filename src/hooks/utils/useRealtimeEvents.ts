import { useEffect, useRef, useCallback } from 'react'; // ✨ Importa useRef e useCallback
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

// A função auxiliar chatMatchesFilters permanece a mesma
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

  // ✨ Refs para gerenciar a conexão e timers sem causar re-renderizações
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<number>(0);

  // ✨ A lógica de conexão é encapsulada em uma função `useCallback`
  const connect = useCallback(() => {
    if (!userId || !token) return;

    // ✨ Limpa conexões ou tentativas de reconexão anteriores
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    const newEventSource = new EventSource(
      `${apiConfig.node}/events/${userId}?token=${encodeURIComponent(token)}`
    );

    // ✨ Armazena a nova instância no ref
    eventSourceRef.current = newEventSource;

    // ✨ Evento para quando a conexão é estabelecida com sucesso
    newEventSource.onopen = () => {
      console.log('[SSE] Conexão estabelecida com sucesso.');
      // Zera o contador de tentativas após uma conexão bem-sucedida
      retryCountRef.current = 0;
    };

    const parseDateBR = (d?: string | null) => {
      if (!d) return 0;
      let iso = d.replace(' ', 'T').replace(/(\.\d{3})\d+/, '$1');
      if (!iso.endsWith('Z') && !iso.includes('+')) iso += 'Z';
      return new Date(iso).getTime();
    };

    // ✨ Lógica de recebimento de mensagens
    newEventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const { event: tipo, connection, message, state, deletedMessage, error } = payload;

        // ======= CONNECTION ERRORS =======
        if (error && message === 'Conexao duplicada') {
          toast.error('Este número já está conectado.');
          setModalState((prev) => ({ ...prev, isOpen: false, step: 1, qrCode: null, isLoading: false }));
          setConnections((prev) => prev.filter((conn) => conn.status !== null));
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
                ? prev.map((c) => (c.id === connection.id ? { ...c, state: 'connecting' } : c))
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

          setMessagesByChat((prev) => {
            const current = prev[chatId] || [];
            const exists = current.find((m) => m.id === message.id);
            return {
              ...prev,
              [chatId]: exists ? current : [...current, message],
            };
          });

          if (activeChat?.id === chatId) {
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
              const shouldBeVisible = chatMatchesFilters(fullChatData, filters, userId);

              setChats((prevChats) => {
                const chatExistsInList = prevChats.some((c) => c.id === chatId);
                let newChats: Chat[];

                if (shouldBeVisible) {
                  const updatedChat = { ...fullChatData, mensagem_data: message.created_at || fullChatData.mensagem_data };
                  newChats = chatExistsInList
                    ? prevChats.map((c) => (c.id === chatId ? updatedChat : c))
                    : [...prevChats, updatedChat];
                } else {
                  newChats = prevChats.filter((c) => c.id !== chatId);
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
                audio.play().catch((err) => console.warn('Erro ao tocar notificação', err));
              }
            })
            .catch((err) => console.error('Erro ao buscar chat para a mensagem recebida:', err));
        }

        // ======= CHAT UPDATES =======
        if (tipo === 'chats.upsert' && payload.chat) {
          const chatId = payload.chat.id;
          setChats((prevChats) => {
            const updatedChats = prevChats.map((c) => (c.id === chatId ? { ...c, unread_count: 0 } : c));
            const unreadCount = updatedChats.filter((c) => c.unread_count > 0).length;
            document.title = unreadCount > 0 ? `(${unreadCount}) WhatsApp - NKW FLOW` : 'WhatsApp - NKW FLOW';
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
              [chatId]: current.map((m) => (m.id === deletedMessage.id ? { ...m, excluded: true } : m)),
            };
          });
        }
      } catch (err) {
        console.error('[SSE] Erro ao processar evento:', err);
      }
    };

    // ✨ Nova lógica de tratamento de erro para reconexão
    newEventSource.onerror = (err) => {
      console.error('[SSE] Erro na conexão, tentando reconectar...', err);
      newEventSource.close(); // Fecha a instância que falhou

      const retryCount = retryCountRef.current;
      // Calcula o tempo de espera: 2s, 4s, 8s, 16s... com um máximo de 60s
      const delay = Math.min(60000, 2000 * Math.pow(2, retryCount));

      console.log(`[SSE] Próxima tentativa de reconexão em ${delay / 1000} segundos.`);

      retryTimeoutRef.current = setTimeout(() => {
        retryCountRef.current += 1; // Incrementa para a próxima possível falha
        connect(); // Tenta reconectar
      }, delay);
    };
    // ✨ As dependências do useCallback devem incluir todas as variáveis e funções externas que ele utiliza
  }, [userId, token, setConnections, setModalState, setChats, setMessagesByChat, filters, activeChat, setActiveChat]);

  // ✨ O useEffect agora gerencia o ciclo de vida da conexão
  useEffect(() => {
    // Inicia a primeira conexão quando o componente montar
    connect();

    // ✨ Função de limpeza para quando o componente for desmontado
    return () => {
      console.log('[SSE] Limpando e fechando conexão ativa.');
      // Cancela qualquer tentativa de reconexão agendada
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      // Fecha a conexão SSE ativa
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [connect]); // O efeito depende da função `connect` memoizada
};