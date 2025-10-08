import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
// Recoil
import { messagesState, chatsState } from '../../state/atom';
// Hooks
import { useApi } from '../utils/useApi';
// Types
import type { Message } from '../../types/message';

export const useMessages = (chatId: string | null) => {
  // Estado Global (Persistente)
  const [messagesByChat, setMessagesByChat] = useRecoilState(messagesState);
  const chats = useRecoilValue(chatsState);

  const { get } = useApi();

  // Estado Local (Reseta ao mudar de chat/desmontar)
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Novo estado para saber se chegamos definitivamente ao fim neste chat
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  // 1. Resetar estados locais quando muda o chatId
  useEffect(() => {
    setNextCursor(null);
    setIsLoading(false);
    setHasReachedEnd(false);
  }, [chatId]);

  // 2. Obter as mensagens atuais do estado global
  const currentChatMessages = useMemo(() => {
    return chatId ? (messagesByChat?.[chatId] ?? []) : [];
  }, [messagesByChat, chatId]);

  // 3. Calcular dinamicamente a mensagem mais antiga que TEMOS (Fonte da verdade)
  const actualOldestTimestamp = useMemo(() => {
    // Se temos mensagens carregadas no Recoil, a primeira é a mais antiga.
    if (currentChatMessages.length > 0) {
      return currentChatMessages[0].criado_em;
    }

    // Fallback: Se não temos nada no Recoil, olhamos para o resumo inicial do chat
    if (chatId && chats) {
      const chat = chats.find(c => c.id === chatId);
      if (chat?.ultimas_mensagens?.length) {
        // A mais antiga do resumo inicial
        return chat.ultimas_mensagens[0].criado_em; 
      }
    }
    return null;
  }, [currentChatMessages, chatId, chats]);


  const fetchMoreMessages = useCallback(async () => {
    // Verificações de segurança: sem chat, carregando, ou já chegou ao fim.
    if (!chatId || isLoading || hasReachedEnd) return;
    
    // Se não temos cursor E não temos timestamp de referência, não tem o que buscar.
    if (!nextCursor && !actualOldestTimestamp) {
         setHasReachedEnd(true);
         return;
    }

    setIsLoading(true);

    const queryParams = new URLSearchParams({ limit: '20' });

    // Prioridade: Cursor da API > Timestamp da mensagem mais antiga que temos
    if (nextCursor) {
      queryParams.append('cursor', nextCursor);
    } else if (actualOldestTimestamp) {
      queryParams.append('oldestMessage', actualOldestTimestamp);
    }

    try {
      const data = await get<{ messages: Message[]; nextCursor: string | null }>(
        `/messages/chat/${chatId}?${queryParams.toString()}`
      );

      if (data && data.messages.length > 0) {
        const reversedMessages = data.messages.reverse();

        setMessagesByChat(prev => {
          const existingMessages = prev?.[chatId] ?? [];
          
          // 4. DEDUPLICAÇÃO: Segurança crucial contra duplicatas
          // Cria um Set com os IDs existentes para verificação rápida O(1)
          const existingIds = new Set(existingMessages.map(m => m.id));
          
          // Filtra apenas as que não temos ainda
          const newUniqueMessages = reversedMessages.filter(
            m => !existingIds.has(m.id)
          );

          return {
            ...prev,
            [chatId]: [
              ...newUniqueMessages,
              ...existingMessages,
            ],
          };
        });

        // Atualiza o cursor ou marca como fim se a API não enviou novo cursor
        if (data.nextCursor) {
            setNextCursor(data.nextCursor);
        } else {
            setNextCursor(null);
            // Se vieram mensagens mas sem cursor, assumimos que é a última página
            setHasReachedEnd(true); 
        }

      } else {
        // Não vieram mensagens, chegamos ao fim.
        setNextCursor(null);
        setHasReachedEnd(true); 
      }
    } finally {
      setIsLoading(false);
    }
  }, [chatId, nextCursor, actualOldestTimestamp, get, setMessagesByChat, isLoading, hasReachedEnd]);


  return {
    messages: currentChatMessages,
    fetchMoreMessages,
    // Tem mais se: não chegou ao fim E (tem cursor OU tem alguma mensagem para usar como ref)
    hasMore: !hasReachedEnd && (!!nextCursor || !!actualOldestTimestamp),
    isLoading,
  };
};