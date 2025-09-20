import { activeChatState } from '@/state/atom';
import { useState, useCallback, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

export function useConfiguracoesPage() {

  const setActiveChat = useSetRecoilState(activeChatState);

  // resetar o chat ativo ao entrar na página
  useEffect(() => {
    setActiveChat(null);
  }, []);

  const tabs = ['Conta', 'Preferências'];

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = useCallback((index: number) => {
    setActiveTab(index);
  }, []);

  return {
    activeTab,
    tabs,
    setActiveTab: handleTabChange,
  };
}