//  Libs
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
// Atom
import { chatsState } from '../../state/atom';
// Utils
import { useApi } from '../utils/useApi'; 
// Types
import type { Chat } from '../../types/chats';


export default function useChats(userId: string) {
  const [chats, setChats] = useRecoilState(chatsState);
  
  const { get } = useApi<Chat[]>();

  useEffect(() => {
    if (!userId) {
      setChats([]);
      return;
    }

    const fetchChats = async () => {
      const data = await get(`/chats/connections/chats/${userId}`);
      
      if (data) {
        setChats(data);
      } else {
        setChats([]);
      }
    };

    fetchChats();
  }, [userId, get, setChats]); 

  return { chats };
}
