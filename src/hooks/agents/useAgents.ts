// Libs
import { useRecoilState } from 'recoil';
import { useCallback } from 'react'; // faltava importar useCallback
// Atom
import { agentsState } from '../../state/atom';
// Types
import type { Agent } from '../../types/agent';
// Utils
import { useApi } from '../utils/useApi';

export const useAgents = () => {
  const [agents, setAgents] = useRecoilState(agentsState);
  const { get } = useApi();

  const fetchAgents = useCallback(async () => {
    const fetchedData = await get<Agent[]>('/agents');
    if (fetchedData) {
      setAgents(fetchedData);
    }
  }, [get, setAgents]);

  return {
    fetchAgents,
  };
};
