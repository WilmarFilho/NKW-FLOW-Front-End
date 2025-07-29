//  Libs
import { useEffect, useCallback } from 'react';
import { useRecoilState } from 'recoil';
// Atom
import { connectionsState } from '../../state/atom';
// Utils
import { useApi } from '../useApi'; 
// Types
import type { Connection } from '../../types/connection';

export const useConnections = () => {
  const [connections, setConnections] = useRecoilState(connectionsState);
  
  const { get, del, put } = useApi<Connection[]>();

  const fetchConnections = useCallback(async () => {
    const data = await get('/connections');
    if (data) {
      setConnections(data);
    } else {
      setConnections([]);
    }
  }, [get, setConnections]);

  // useEffect para carregar as conexões na montagem do componente.
  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]); 

  const removeConnection = async (id: string, nome: string) => {
    try {
      const result = await del(`/connections/${id}/${nome}`);
      if (result !== null) {
        setConnections(current => current.filter(c => c.id !== id));
      } else {
        throw new Error('Falha ao deletar a conexão. Verifique o estado de erro do hook.');
      }
    } catch (err) {
      console.error('Falha ao deletar conex:', err);
      throw err; 
    }
  };

  return { 
    connections, 
    removeConnection,
    fetchConnections,
  };
};




