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
  // Extrai loading e error diretamente do useApi
  const { get, del, put, loading, error } = useApi();

  const fetchConnections = useCallback(async () => {
    // O estado de loading é gerenciado pelo useApi
    const data = await get<Connection[]>('/connections');
    if (data) {
      setConnections(data);
    } else {
      // Em caso de erro na busca, o useApi já trata o estado de erro
      setConnections([]);
    }
  }, [get, setConnections]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const removeConnection = useCallback(async (id: string) => {
    // O useApi gerencia o loading e o erro automaticamente
    const result = await del(`/connections/${id}`);
    if (result !== null) {
      // Se a deleção for bem-sucedida, atualiza o estado local
      setConnections(current => current.filter(c => c.id !== id));
    }
    // O tratamento de erro já é feito no useApi, o erro pode ser relançado ou tratado aqui se necessário
  }, [del, setConnections]);

  const updateConnectionStatus = useCallback(async (connection: Connection) => {
    // Inverte o status atual
    const newStatus = !connection.status;

    // Payload para a requisição, mantendo os outros dados
    const payload = {
      nome: connection.nome,
      agente_id: connection.agente_id,
      status: newStatus,
    };

    const updatedConnection = await put<Connection>(`/connections/${connection.id}`, payload);

    if (updatedConnection) {
      // Atualiza o estado do Recoil com a conexão modificada
      setConnections(current =>
        current.map(c =>
          c.id === connection.id ? { ...c, status: newStatus } : c
        )
      );
    }
    // O tratamento de erro já é feito pelo useApi
  }, [put, setConnections]);

  return {
    connections,
    loading, // Exporta o estado de loading do useApi
    error,   // Exporta o estado de erro do useApi
    removeConnection,
    fetchConnections,
    updateConnectionStatus,
  };
};