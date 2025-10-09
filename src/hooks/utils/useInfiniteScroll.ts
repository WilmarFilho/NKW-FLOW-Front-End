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

  const [canFetch, setCanFetch] = useState(false); // só pode fetch depois do scroll inicial
  const lockRef = useRef(false); // lock para evitar múltiplos fetches

  // scroll inicial para o final do chat
 useLayoutEffect(() => {
  if (!activeChat) return;
  const list = listRef.current;
  if (!list) return;

  const scrollToBottom = () => {
    list.scrollTo({ top: list.scrollHeight, behavior: 'auto' });
    setCanFetch(true); // habilita fetch após scroll inicial
  };

  // Pega todas as imagens dentro do container
  const images = list.querySelectorAll('img');

  if (images.length === 0) {
    // Se não houver imagens, faz scroll imediatamente
    scrollToBottom();
    return;
  }

  let loadedCount = 0;

  const handleImageLoad = () => {
    loadedCount += 1;
    if (loadedCount === images.length) {
      // todas as imagens carregadas, faz scroll
      scrollToBottom();
    }
  };

  images.forEach((img) => {
    if (img.complete) {
      handleImageLoad();
    } else {
      img.addEventListener('load', handleImageLoad);
      img.addEventListener('error', handleImageLoad); // mesmo se der erro, conta
    }
  });

  return () => {
    images.forEach((img) => {
      img.removeEventListener('load', handleImageLoad);
      img.removeEventListener('error', handleImageLoad);
    });
  };
}, [activeChat?.id]);


  // Observer para scroll no topo
  useEffect(() => {
    const list = listRef.current;
    const sentinel = topSentinelRef.current;
    if (!list || !sentinel || !canFetch) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        for (const entry of entries) {
          if (
            entry.isIntersecting &&
            hasMore &&
            !isLoading &&
            !lockRef.current
          ) {
            lockRef.current = true; // bloqueia fetch até terminar
            await fetchMoreMessages();
            lockRef.current = false;
          }
        }
      },
      { root: list, rootMargin: '350px', threshold: 0.2 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoading, fetchMoreMessages, canFetch]);

  return { listRef, topSentinelRef };
}
