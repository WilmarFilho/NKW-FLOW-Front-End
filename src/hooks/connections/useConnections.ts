// Libs
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
// Recoil
import { connectionsState, userState } from '../../state/atom';
// Hooks
import { useApi } from '../utils/useApi';
// Types
import type { Connection } from '../../types/connection';
import { User } from '../../types/user';

export const useConnections = () => {

  // Carrega Usuário
  const [user] = useRecoilState(userState)

  // Carrega Conexões
  const [connections, setConnections] = useRecoilState(connectionsState);

  // Carrega Metodos do hook da api
  const { get } = useApi();

  const fetchConnections = useCallback(async (userParam?: User) => {

    const currentUser = userParam ?? user;
    if (!currentUser) return;

    const data = await get<Connection[]>(`/connections/${currentUser.id}`);
    
    if (data) {
      setConnections(data);
    }

  }, [get, setConnections]);

  return { fetchConnections };
};