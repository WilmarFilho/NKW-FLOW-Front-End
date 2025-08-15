import { useState, useCallback } from 'react';

const tabs = ['Conta', 'Preferências'];

export function useConfiguracoesPage() {
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