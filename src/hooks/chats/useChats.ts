import { useCallback, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { chatsState, userState, nextCursorState } from '../../state/atom';
import { useApi } from '../utils/useApi';
import type { Chat, ChatFilters } from '../../types/chats';
import { User } from '../../types/user';
import { filter } from '@chakra-ui/react';

interface UseChatsReturn {
  fetchChats: (filters?: ChatFilters, userParam?: User) => Promise<Chat[] | undefined>;
  fetchMoreChats: () => Promise<void>;
  fetchImageProfile: (chatId: string) => Promise<Chat | null>;
  hasMore: boolean;
  loading: boolean;
}

export const useChats = (): UseChatsReturn => {
  const [user] = useRecoilState(userState);
  const setChats = useSetRecoilState(chatsState);
  const [nextCursor, setNextCursor] = useRecoilState(nextCursorState);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [currentFilters, setCurrentFilters] = useState<ChatFilters>({});
  const [, setSessionId] = useState<number>(Date.now());

  const { get, put } = useApi();

  const updateDocumentTitle = (chats: Chat[]) => {
    const unreadCount = chats.filter(c => c.unread_count > 0).length;
    document.title = unreadCount > 0 ? `(${unreadCount}) WhatsApp - NKW FLOW` : 'WhatsApp - NKW FLOW';
  };

  // 🔹 Função para carregar chats com filtros (resetando a lista)
  const fetchChats = useCallback(
    async (filters: ChatFilters = {}, userParam?: User) => {
      const currentUser = userParam ?? user;
      if (!currentUser) return;

      console.log(filters);

      setLoading(true);
      setNextCursor(null);
      setHasMore(true);
      setChats([]);
      setCurrentFilters(filters);
      const newSessionId = Date.now();
      setSessionId(newSessionId);

      try {
        const params = { user_id: currentUser.id, auth_id: currentUser.auth_id, ...filters };
        const fetchedData = await get<{ chats: Chat[]; nextCursor: string | null }>('/chats', { params });

        if (fetchedData) {
          setChats(fetchedData.chats);
          updateDocumentTitle(fetchedData.chats)
          setNextCursor(fetchedData.nextCursor);
          setHasMore(!!fetchedData.nextCursor);
          return fetchedData.chats;
        }
      } finally {
        setLoading(false);
      }
    },
    [get, setChats, user, setNextCursor]
  );

  // 🔹 Função para carregar mais chats (scroll infinito)
  const fetchMoreChats = useCallback(async () => {
    if (!user || loading || !hasMore || !nextCursor) return;

    setLoading(true);

    try {
      const params = { user_id: user.id, cursor: nextCursor, ...currentFilters };
      const fetchedData = await get<{ chats: Chat[]; nextCursor: string | null }>('/chats', { params });

      if (fetchedData?.chats.length) {
        setChats(prev => {
          // Evita duplicação
          const newChats = fetchedData.chats.filter(
            chat => !prev.some(c => c.id === chat.id)
          );
          return [...prev, ...newChats];
        });
        setNextCursor(fetchedData.nextCursor);
        setHasMore(!!fetchedData.nextCursor);
      } else {
        setNextCursor(null);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  }, [user, loading, hasMore, nextCursor, currentFilters, get, setChats, setNextCursor]);

  // 🔹 Atualiza a foto de perfil de um chat
  const fetchImageProfile = useCallback(async (chatId: string) => {
    const updatedChat = await put<Chat>(`/chats/fetchImage/${chatId}`);
    return updatedChat;
  }, [put]);

  return {
    fetchChats,
    fetchMoreChats,
    fetchImageProfile,
    hasMore,
    loading,
  };
};