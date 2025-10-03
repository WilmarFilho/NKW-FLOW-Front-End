// Libs
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
// Recoil
import { messagesState, chatsState } from '../../state/atom';
// Hooks
import { useApi } from '../utils/useApi';
// Types
import type { Message } from '../../types/message';

export const useMessages = (chatId: string | null) => {
  // Agora cada chat tem seu próprio array de mensagens
  const [messagesByChat, setMessagesByChat] = useRecoilState(messagesState);
  const setChats = useSetRecoilState(chatsState);

  const { get, post } = useApi();

  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar primeiras mensagens
  useEffect(() => {
    if (!chatId) return;

    // Reseta mensagens só do chat atual
    setMessagesByChat((prev) => ({ ...prev, [chatId]: [] }));
    setNextCursor(null);

    const fetchInitialMessages = async () => {
      setIsLoading(true);
      const data = await get<{ messages: Message[]; nextCursor: string | null }>(
        `/messages/chat/${chatId}?limit=20`
      );

      if (data) {
        setMessagesByChat((prev) => ({
          ...prev,
          [chatId]: data.messages.reverse(),
        }));
        setNextCursor(data.nextCursor || null);
        // --- Marca como lido ---
        setChats((currentChats) => {
          const chat = currentChats ? currentChats.find((c) => c.id === chatId) : null;
          if (chat && chat.unread_count > 0) {

            const totalUnreadChats = currentChats ? currentChats.filter((c) => c.unread_count > 0).length : 0;


            const unreadCount = totalUnreadChats - 1;

            document.title =
              unreadCount > 0
                ? `(${unreadCount}) WhatsApp - NKW FLOW`
                : 'WhatsApp - NKW FLOW';

            post(`/chats_reads/${chatId}`);
          }

          // zera o contador do chat atual
          return currentChats ? currentChats.map((c) =>
            c.id === chatId ? { ...c, unread_count: 0 } : c
          ) : [];
        });

      }
      setIsLoading(false);
    };

    fetchInitialMessages();
  }, [chatId, get, post, setMessagesByChat, setChats, ]);

  // Carregar mais mensagens (scroll para cima)
  const fetchMoreMessages = useCallback(async () => {
    if (!chatId || !nextCursor || isLoading) return;
    setIsLoading(true);

    const data = await get<{ messages: Message[]; nextCursor: string | null }>(
      `/messages/chat/${chatId}?limit=20&cursor=${nextCursor}`
    );

    if (data && data.messages.length > 0) {
      setMessagesByChat((prevRaw) => {
        const prev = prevRaw ?? {};
        return {
          ...prev,
          [chatId]: [
            ...data.messages.reverse(),
            ...(prev[chatId] || []),
          ],
        };
      });
      setNextCursor(data.nextCursor || null);
    } else if (data) {
      setNextCursor(null);
    }
    setIsLoading(false);
  }, [chatId, nextCursor, get, setMessagesByChat, isLoading]);

  // Mensagens só do chat atual
  const messages = useMemo(() => {
    return chatId ? (messagesByChat ? messagesByChat[chatId] ?? [] : []) : [];
  }, [messagesByChat, chatId]);

  return {
    messages,
    fetchMoreMessages,
    hasMore: nextCursor !== null,
    isLoading,
  };
};