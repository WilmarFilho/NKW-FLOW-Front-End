import { Chat } from '@/types/chats';
import { Message } from '../../types/message';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface UseInfiniteScrollProps {
  activeChat: Chat | null;
  fetchMoreMessages: () => void;
  hasMore: boolean;
  isLoading: boolean;
  messages: Message[];
  chatId?: string | null;
}

export function useInfiniteScroll({
  fetchMoreMessages,
  hasMore,
  isLoading,
  messages,
  activeChat
}: UseInfiniteScrollProps) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const [canFetch, setCanFetch] = useState(false);
  const [canScrollInitial, setCanScrollInitial] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  // reset flags quando trocar de chat
  useEffect(() => {
    setCanScrollInitial(true);
    setCanFetch(false);
  }, [activeChat]);

  useLayoutEffect(() => {
    if (!activeChat) return;
    if (!canScrollInitial) return;
    if (messages.length === 0) return; // só roda se já carregaram mensagens

    const list = listRef.current;
    if (!list) return;

    // espera 2 frames
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        list.scrollTo({ top: list.scrollHeight, behavior: 'auto' });
        setCanScrollInitial(false);
        setCanFetch(true);
      });
    });
  }, [activeChat, messages, canScrollInitial]);


  // Observer
  useEffect(() => {
    const list = listRef.current;
    const sentinel = topSentinelRef.current;
    if (!list || !sentinel) return;
    if (!canFetch) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            hasMore &&
            !isLoading &&
            !isFetching &&
            canFetch
          ) {
            setIsFetching(true);

            // pega a altura atual do scroll para manter posição
            const previousScrollHeight = list.scrollHeight;

            fetchMoreMessages();

            // libera fetch quando as novas mensagens forem renderizadas
            const timeout = setTimeout(() => {
              if (list.scrollHeight > previousScrollHeight) {
                // mantém o scroll na posição visual original
                list.scrollTop += list.scrollHeight - previousScrollHeight;
              }
              setIsFetching(false);
            }, 100); // 100ms costuma ser suficiente

            return () => clearTimeout(timeout);
          }
        });
      },
      { root: list, rootMargin: '300px', threshold: 0.2 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoading, fetchMoreMessages, canFetch]);

  return { listRef, topSentinelRef, };
}