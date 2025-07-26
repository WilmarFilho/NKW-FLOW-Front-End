import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { connectionsState } from '../state/atom';
import { apiConfig } from '../config/api';
import type { Connection } from '../types/connection';

export const useConnections = () => {
  const [connections, setConnections] = useRecoilState(connectionsState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarConexoes = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiConfig.node}/connections`);
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: 'Erro desconhecido' }));
          throw new Error(err.message);
        }

        const data: Connection[] = await res.json();
        setConnections(data);
        setError(null);
      } catch {
        console.error('[Conexões] Erro ao buscar:');
        setConnections([]);
        setError('Erro');
      } finally {
        setLoading(false);
      }
    };

    carregarConexoes();
  }, [setConnections]);

  return { connections, loading, error };
};
