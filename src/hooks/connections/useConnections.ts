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
  const { get } = useApi();

  const fetchConnections = useCallback(async (userParam?: User) => {

    const currentUser = userParam ?? user;
    if (!currentUser) return;

    const data = await get<Connection[]>(`/connections/${currentUser.id}`);

    if (data) {
      setConnections(data);
    } 

  }, [get]);

  return {
    fetchConnections
  };
};