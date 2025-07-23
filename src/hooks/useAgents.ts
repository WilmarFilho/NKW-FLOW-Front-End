import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { agentsState } from '../state/atom';
import type { Agent } from '../types/agent';
import { apiConfig } from '../config/api';

const fetchAgentsFromAPI = async (): Promise<Agent[]> => {
    const response = await fetch(`${apiConfig.node}/agents`);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido no servidor' }));
        throw new Error(errorData.message || 'Falha ao buscar os agentes');
    }
    const data = await response.json();
    return data;
};

export const useAgents = () => {
    const [agents, setAgents] = useRecoilState(agentsState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        
        if (agents.length > 0) {
            setLoading(false);
            return;
        }

        setLoading(true);
        fetchAgentsFromAPI()
            .then(data => {
                setAgents(data);
                setError(null);
            })
            .catch(err => {
                console.error('Falha ao buscar conexões:', err);
                setError(err.message);
                setAgents([]);
            })
            .finally(() => {
                setLoading(false);
            });
        
    }, [setAgents, agents.length]);

    return {
        agents,
        loading,
        error,
    };
};