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
  activeChat
}: UseInfiniteScrollProps) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);

  const [canFetch, setCanFetch] = useState(false);
  const [lock, setLock] = useState(false); // lock para evitar múltiplos fetches

  // scroll inicial para o final
  useLayoutEffect(() => {
    if (!activeChat) return;

    const list = listRef.current;
    if (!list) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        list.scrollTo({ top: list.scrollHeight, behavior: 'auto' });
        setCanFetch(true);
      });
    });
  }, [activeChat?.id]);

  // Observer para scroll no topo
  useEffect(() => {
    const list = listRef.current;
    const sentinel = topSentinelRef.current;
    if (!list || !sentinel || !canFetch) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && hasMore && !isLoading && !lock) {
            setLock(true); // bloqueia novos fetches
            await fetchMoreMessages();
            setLock(false); // libera após completar
          }
        }
      },
      { root: list, rootMargin: '350px', threshold: 0.2 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoading, fetchMoreMessages, canFetch, lock]);

  return { listRef, topSentinelRef };
}

