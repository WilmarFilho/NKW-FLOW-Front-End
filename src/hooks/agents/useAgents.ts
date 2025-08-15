// Libs
import { useRecoilState } from 'recoil';
import { useCallback } from 'react';
// Recoil
import { agentsState, userState } from '../../state/atom';
// Hooks
import { useApi } from '../utils/useApi';
// Types
import type { Agent } from '../../types/agent';

export const useAgents = () => {

  // Carrega Usuário
  const [user] = useRecoilState(userState)

  // Carrega Agentes
  const [agents, setAgents] = useRecoilState(agentsState);

  // Carrega Metodos do hook da api
  const { get } = useApi();

  const fetchAgents = useCallback(async () => {
    const fetchedData = await get<Agent[]>('/agents');

    if (fetchedData) {
      setAgents(fetchedData);
    }
    
  }, [get, setAgents]);

  return { fetchAgents };
};