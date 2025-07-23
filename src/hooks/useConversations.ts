import { useEffect, useState } from 'react';
import { Chat } from '../types/chats';
import { apiConfig } from '../config/api';

export default function useConversations(userId: string) {
    const [conversations, setConversations] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchChats() {
            fetch(`${apiConfig.node}/api/chats/user/${userId}`)
                .then(async (res) => {
                    if (!res.ok) {
                        const errData = await res.json().catch(() => ({ message: 'Erro desconhecido' }));
                        throw new Error(errData.message);
                    }
                    return res.json();
                })
                .then((data: Chat[]) => {
                    setConversations(data);
                })
                .catch((err) => {
                    console.error('Falha ao buscar chats:', err);
                    setConversations([]);
                })
                .finally(() => setLoading(false));
        }

        if (userId) fetchChats();
    }, [userId]);

    return { conversations, loading };
}
