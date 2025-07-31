// Libs
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
// Atom
import { agentsState } from '../../state/atom';
// Types
import type { Agent } from '../../types/agent';
// Utils
import { useApi } from '../utils/useApi';

export const useAgents = () => {
  const [agents, setAgents] = useRecoilState(agentsState);
  const { get } = useApi<Agent[]>();

  const fetchAgents = async () => {
    const fetchedData = await get('/agents');
    if (fetchedData) {
      setAgents(fetchedData);
    }
  };

  // Efeito para carregar agents na montagem do componente
  useEffect(() => {
    fetchAgents();
  }, [get, setAgents]);


  return {
    agents,
  };
};

