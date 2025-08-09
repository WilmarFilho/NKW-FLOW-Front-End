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
  const { get } = useApi();

  const fetchAgents = async () => {
    const fetchedData = await get<Agent[]>('/agents');
    if (fetchedData) {
      setAgents(fetchedData);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [get, setAgents]);

  return {
    agents,
  };
};