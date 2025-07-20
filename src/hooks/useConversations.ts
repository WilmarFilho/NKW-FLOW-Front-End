import { useEffect, useState } from 'react';
//import { useRecoilState } from 'recoil';
//import { agentsState } from '../state/atom';
import type { Contact, Message } from '../types/conversation';
import { apiConfig } from '../config/api';

/**
 * Busca todas as conversas ativas na API.
 */
const fetchConversationsFromAPI = async (): Promise<Contact[]> => {
    const response = await fetch(`${apiConfig.node}/conversations`);
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro ao buscar as conversas' }));
        throw new Error(errorData.message || 'Falha ao buscar as conversas');
    }
    
    return response.json();
};

/**
 * Busca mensagens de uma conversa específica na API.
 */
const fetchMessagesFromAPI = async (conversationId: string): Promise<Message[]> => {
    const response = await fetch(`${apiConfig.node}/conversations/${conversationId}/messages`);
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro ao buscar as mensagens' }));
        throw new Error(errorData.message || 'Falha ao buscar as mensagens');
    }
    
    return response.json();
};

export const useConversations = () => {
    const [conversations, setConversations] = useState<Contact[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [messages, setMessages] = useState<{ [conversationId: string]: Message[] }>({});
    const [loadingMessages, setLoadingMessages] = useState<{ [conversationId: string]: boolean }>({});

    useEffect(() => {
        // Evita buscar novamente se o estado já tiver sido populado
        if (conversations.length > 0) {
            setLoading(false);
            return;
        }

        setLoading(true);
        fetchConversationsFromAPI()
            .then(data => {
                setConversations(data);
                setError(null);
            })
            .catch(err => {
                console.error('Falha ao buscar conversas:', err);
                setError(err.message);
                setConversations([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [conversations.length]);

    /**
     * Busca mensagens de uma conversa específica.
     */
    const fetchMessages = async (conversationId: string) => {
        if (messages[conversationId]) {
            return; // Já carregadas
        }

        setLoadingMessages(prev => ({ ...prev, [conversationId]: true }));
        
        try {
            const data = await fetchMessagesFromAPI(conversationId);
            setMessages(prev => ({ ...prev, [conversationId]: data }));
        } catch (err) {
            console.error(`Falha ao buscar mensagens da conversa ${conversationId}:`, err);
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoadingMessages(prev => ({ ...prev, [conversationId]: false }));
        }
    };
    
    /**
     * Seleciona uma conversa e carrega suas mensagens.
     */
    const selectConversation = (conversationId: string) => {
        setSelectedConversation(conversationId);
        fetchMessages(conversationId);
    };

    /**
     * Recarrega a lista de conversas.
     */
    const refreshConversations = () => {
        setConversations([]);
        setError(null);
    };

    return {
        conversations,
        loading,
        error,
        selectedConversation,
        messages,
        loadingMessages,
        fetchMessages,
        selectConversation,
        refreshConversations,
    };
};

