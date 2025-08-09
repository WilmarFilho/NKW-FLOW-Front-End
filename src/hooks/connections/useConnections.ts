// Libs
import { useEffect, useCallback } from 'react';
import { useRecoilState } from 'recoil';
// Atom
import { connectionsState } from '../../state/atom';
// Utils
import { useApi } from '../utils/useApi';
// Types
import type { Connection } from '../../types/connection';

export const useConnections = () => {
  const [connections, setConnections] = useRecoilState(connectionsState);
  const { get, del, put } = useApi();

  const fetchConnections = useCallback(async () => {
    const data = await get<Connection[]>('/connections');
    if (data) {
      setConnections(data);
    } else {
      setConnections([]);
    }
  }, [get, setConnections]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const removeConnection = useCallback(async (id: string) => {
    const result = await del(`/connections/${id}`);
    if (result !== null) {
      fetchConnections();
    }
  }, [del, setConnections]);

  const updateConnectionStatus = useCallback(async (connection: Connection) => {

    const newStatus = !connection.status;

    // Payload para a requisição, mantendo os outros dados
    const payload = {
      nome: connection.nome,
      agente_id: connection.agente_id,
      status: newStatus,
    };

    const updatedConnection = await put<Connection>(`/connections/${connection.id}`, payload);

    if (updatedConnection) {
      fetchConnections();
    }

  }, [put, setConnections]);

  return {
    connections,
    removeConnection,
    fetchConnections,
    updateConnectionStatus,
  };
};