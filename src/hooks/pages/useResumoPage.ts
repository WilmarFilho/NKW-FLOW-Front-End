// Libs
import { useState } from 'react';
// Components
import { ViewType, DropdownId } from '../../components/Resumo/DropdownPeriod/DropdownPeriod';

export function useResumoPage() {
  const [viewChatsNovos, setViewChatsNovos] = useState<ViewType>('weekly');
  const [viewChatsFechados, setViewChatsFechados] = useState<ViewType>('weekly');
  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);

  // Dados mockados
  const weeklyData = [
    { name: 'Seg', chats: 12 },
    { name: 'Ter', chats: 5 },
    { name: 'Qua', chats: 8 },
    { name: 'Qui', chats: 15 },
    { name: 'Sex', chats: 20 },
    { name: 'Sáb', chats: 10 },
    { name: 'Dom', chats: 7 },
  ];

  const monthlyData = [
    { name: 'Fev', chats: 17 },
    { name: 'Mar', chats: 3 },
    { name: 'Abr', chats: 8 },
    { name: 'Mai', chats: 16 },
    { name: 'Jun', chats: 2 },
    { name: 'Jul', chats: 10 },
    { name: 'Ago', chats: 70 },
  ];

  const dataNovos = viewChatsNovos === 'weekly' ? weeklyData : monthlyData;
  const dataFechados = viewChatsFechados === 'weekly' ? weeklyData : monthlyData;

  const dataConexoes = [
    { name: 'Principal', value: 32 },
    { name: 'Unidade Bueno', value: 18 },
    { name: 'Vila Nova', value: 14 },
    { name: 'Reserva', value: 20 },
    { name: 'Empresarial', value: 8 },
  ];

  const dataAtendentes = [
    { name: 'João', chats: 26 },
    { name: 'Maria', chats: 15 },
    { name: 'Pedro', chats: 10 },
    { name: 'João', chats: 20 },
    { name: 'Maria', chats: 15 },
    { name: 'Pedro', chats: 10 },
  ];

  const heightAtedentes = dataAtendentes.length * 50;
  const widthConexoes = Math.max(dataConexoes.length * 120, 300);

  return {
    viewChatsNovos,
    setViewChatsNovos,
    viewChatsFechados,
    setViewChatsFechados,
    openDropdown,
    setOpenDropdown,
    dataNovos,
    dataFechados,
    dataConexoes,
    dataAtendentes,
    heightAtedentes,
    widthConexoes
  };
}