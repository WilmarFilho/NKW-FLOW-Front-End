// Libs
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
// Atom
import { connectionsState, userState } from '../../state/atom';
// Utils
import { useApi } from '../utils/useApi';
// Types
import type { Connection } from '../../types/connection';
import { User } from '../../types/user';

export const useConnections = () => {
  const [user] = useRecoilState(userState)
  const [connections, setConnections] = useRecoilState(connectionsState);
  const { get, del, put } = useApi();

  const fetchConnections = useCallback(async (userParam?: User) => {

    const currentUser = userParam ?? user;
    if (!currentUser) return;

    const data = await get<Connection[]>(`/connections/${currentUser.id}`);

    if (data) {
      setConnections(data);
    } 

  }, [get]);

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
    removeConnection,
    fetchConnections,
    updateConnectionStatus,
  };
};