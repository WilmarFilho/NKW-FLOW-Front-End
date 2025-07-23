import { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { connectionsState } from '../state/atom';
import type { Connection } from '../types/connection';
import { apiConfig } from '../config/api';

export const useConnectionsComStatus = () => {
  const [connections, setConnections] = useRecoilState(connectionsState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const activeListeners = useRef<Map<string, EventSource>>(new Map());

  // --- 1. Carregar conexões da API (uma vez) ---
  useEffect(() => {
    if (connections.length > 0) {
      setLoading(false);
      return;
    }

    fetch(`${apiConfig.node}/connections`)
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({ message: 'Erro desconhecido' }));
          throw new Error(errData.message);
        }
        return res.json();
      })
      .then((data: Connection[]) => {
        setConnections(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Falha ao buscar conexões:', err);
        setError(err.message);
        setConnections([]);
      })
      .finally(() => setLoading(false));
  }, [connections.length, setConnections]);

  // --- 2. Gerenciar listeners SSE em tempo real ---
  useEffect(() => {
    const currentInstances = new Set(connections.map(c => c.nome));

    connections.forEach(conn => {
      if (!activeListeners.current.has(conn.nome)) {
        console.log(`[Monitor] Criando listener para ${conn.nome}`);
        const eventSource = new EventSource(`${apiConfig.node}/connections/webhook/events/${conn.nome}`);

        eventSource.onmessage = (event) => {
          const eventData = JSON.parse(event.data);
          if (eventData.event === 'connection.update') {
            const isConnected = eventData.state === 'open';
            console.log(eventData)
            if (!isConnected) {
              console.log(`[Monitor] ${conn.nome} desconectado. Atualizando lista.`);
              setConnections(prev => prev.filter(c => c.nome !== conn.nome));
            }
          }
        };

        eventSource.onerror = () => {
          console.warn(`[Monitor] Erro no SSE de ${conn.nome}. Removendo.`);
          setConnections(prev => prev.filter(c => c.nome !== conn.nome));
          eventSource.close();
          activeListeners.current.delete(conn.nome);
        };

        activeListeners.current.set(conn.nome, eventSource);
      }
    });

    // Encerrar listeners antigos
    activeListeners.current.forEach((es, nome) => {
      if (!currentInstances.has(nome)) {
        console.log(`[Monitor] Encerrando listener de ${nome}`);
        es.close();
        activeListeners.current.delete(nome);
      }
    });

    return () => {
      activeListeners.current.forEach(es => es.close());
      activeListeners.current.clear();
    };
  }, [connections, setConnections]);

  return {
    connections,
    loading,
    error,
  };
};
