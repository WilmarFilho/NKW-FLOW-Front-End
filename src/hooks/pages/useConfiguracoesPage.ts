import { useState, useCallback } from 'react';

export function useConfiguracoesPage() {

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