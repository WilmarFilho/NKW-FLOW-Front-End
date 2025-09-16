import { Message } from '../../types/message';
import { useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollProps {
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
  chatId
}: UseInfiniteScrollProps) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [canFetch, setCanFetch] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Reset quando troca de chat
  useEffect(() => {
    setHasScrolledToBottom(false);
    setCanFetch(false);
  }, [chatId]);

  // Scroll inicial apenas ao trocar de chat
  useEffect(() => {
    if (hasScrolledToBottom) return;
    const list = listRef.current;
    if (!list || messages.length === 0) return;

    list.scrollTo({ top: list.scrollHeight, behavior: 'auto' }); // primeiro auto para colocar no final imediatamente
    setHasScrolledToBottom(true);

    const onScrollComplete = () => {
      setCanFetch(true);
      list.removeEventListener('scroll', onScrollComplete);
    };

    list.addEventListener('scroll', onScrollComplete);
    return () => list.removeEventListener('scroll', onScrollComplete);
  }, [messages]);


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
  }, [hasMore, isLoading, fetchMoreMessages, canFetch, isFetching]);


  return { listRef, topSentinelRef, };
}
