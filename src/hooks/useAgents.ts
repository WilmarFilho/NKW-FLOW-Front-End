import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { agentsState } from '../state/atom';
import type { Agent } from '../types/agent';
import { apiConfig } from '../config/api';

/**
 * Busca todas as conexões ativas na API.
 */
const fetchAgentsFromAPI = async (): Promise<Agent[]> => {
    const response = await fetch(`${apiConfig.node}/agentes`);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido no servidor' }));
        throw new Error(errorData.message || 'Falha ao buscar os agentes');
    }
    return response.json();
};


// =======================================================
// Hook Personalizado (Apenas para consulta)
// =======================================================

export const useAgents = () => {
    const [agents, setAgents] = useRecoilState(agentsState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Evita buscar novamente se o estado já tiver sido populado
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
        // A dependência [setConnections] garante que isso rode apenas uma vez.
    }, [setAgents, agents.length]);

    // Retorna apenas os dados e os estados, sem funções de modificação.
    return {
        agents,
        loading,
        error,
    };
};