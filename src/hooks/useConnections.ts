import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { connectionsState } from '../state/atom';
import type { Connection } from '../types/connection';
import { apiConfig } from '../config/api';

/**
 * Busca todas as conexões ativas na API.
 */
const fetchConnectionsFromAPI = async (): Promise<Connection[]> => {
    const response = await fetch(`${apiConfig.node}/connections`);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido no servidor' }));
        throw new Error(errorData.message || 'Falha ao buscar as conexões');
    }
    return response.json();
};


// =======================================================
// Hook Personalizado (Apenas para consulta)
// =======================================================

export const useConnections = () => {
    const [connections, setConnections] = useRecoilState(connectionsState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Evita buscar novamente se o estado já tiver sido populado
        if (connections.length > 0) {
            setLoading(false);
            return;
        }

        setLoading(true);
        fetchConnectionsFromAPI()
            .then(data => {
                setConnections(data);
                setError(null);
            })
            .catch(err => {
                console.error("Falha ao buscar conexões:", err);
                setError(err.message);
                setConnections([]);
            })
            .finally(() => {
                setLoading(false);
            });
        // A dependência [setConnections] garante que isso rode apenas uma vez.
    }, [setConnections, connections.length]);

    // Retorna apenas os dados e os estados, sem funções de modificação.
    return {
        connections,
        loading,
        error,
    };
};