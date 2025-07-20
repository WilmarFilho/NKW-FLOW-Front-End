// src/hooks/useConnectionsComStatus.ts
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
    const currentInstances = new Set(connections.map(c => c.instanceName));

    connections.forEach(conn => {
      if (!activeListeners.current.has(conn.instanceName)) {
        console.log(`[Monitor] Criando listener para ${conn.instanceName}`);
        const eventSource = new EventSource(`${apiConfig.node}/webhook/events/${conn.instanceName}`);

        eventSource.onmessage = (event) => {
          const eventData = JSON.parse(event.data);
          if (eventData.event === 'connection.update') {
            const isConnected = eventData.state === 'open';
            if (!isConnected) {
              console.log(`[Monitor] ${conn.instanceName} desconectado. Atualizando lista.`);
              setConnections(prev => prev.filter(c => c.instanceName !== conn.instanceName));
            }
          }
        };

        eventSource.onerror = () => {
          console.warn(`[Monitor] Erro no SSE de ${conn.instanceName}. Removendo.`);
          setConnections(prev => prev.filter(c => c.instanceName !== conn.instanceName));
          eventSource.close();
          activeListeners.current.delete(conn.instanceName);
        };

        activeListeners.current.set(conn.instanceName, eventSource);
      }
    });

    // Encerrar listeners antigos
    activeListeners.current.forEach((es, instanceName) => {
      if (!currentInstances.has(instanceName)) {
        console.log(`[Monitor] Encerrando listener de ${instanceName}`);
        es.close();
        activeListeners.current.delete(instanceName);
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
