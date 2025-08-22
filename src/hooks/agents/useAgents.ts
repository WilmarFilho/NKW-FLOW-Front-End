import { useRecoilState, useSetRecoilState } from 'recoil';
import { useCallback } from 'react';
import { agentsState, userState } from '../../state/atom';
import { useApi } from '../utils/useApi';
import type { Agent } from '../../types/agent';
import { User } from '../../types/user';

export const useAgents = () => {
  const [user] = useRecoilState(userState);
  const setAgents = useSetRecoilState(agentsState);
  const { get } = useApi();

  const fetchAgents = useCallback(async (userParam?: User) => {

    const currentUser = userParam ?? user;
    if (!currentUser) return;

    if (currentUser.tipo_de_usuario !== 'admin') return

    const fetchedData = await get<Agent[]>('/agents', {
      params: { user_id: currentUser.id }
    });


    if (fetchedData) {
      setAgents(fetchedData);
    }
  }, [get, user, setAgents]);

  return { fetchAgents };
};