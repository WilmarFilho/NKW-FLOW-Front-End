import { useRecoilValue } from 'recoil';
import { metricsState } from '../../state/atom';
import { useState } from 'react';
import { ViewType, DropdownId } from '../../components/Resumo/DropdownPeriod/DropdownPeriod';

export function useResumoPage() {
  const metrics = useRecoilValue(metricsState);

  const [viewChatsNovos, setViewChatsNovos] = useState<ViewType>('weekly');
  const [viewChatsFechados, setViewChatsFechados] = useState<ViewType>('weekly');
  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);

  const heightAtedentes = metrics.atendentes.length * 50;
  const widthConexoes = Math.max(metrics.conexoes.length * 120, 300);

  return {
    viewChatsNovos,
    setViewChatsNovos,
    viewChatsFechados,
    setViewChatsFechados,
    openDropdown,
    setOpenDropdown,
    dataNovos: metrics.novos,
    dataFechados: metrics.fechados,
    dataConexoes: metrics.conexoes,
    dataAtendentes: metrics.atendentes,
    heightAtedentes,
    widthConexoes,
  };
}