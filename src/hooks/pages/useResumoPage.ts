// Libs
import { useState, useEffect } from 'react';
// Removido AxiosResponse, pois seu hook já retorna os dados diretamente
import { useApi } from '../utils/useApi';
// Components
import { ViewType, DropdownId } from '../../components/Resumo/DropdownPeriod/DropdownPeriod';

// Tipos para os dados
interface ChatsMetric {
  name: string;
  chats: number;
}

interface ConnectionsMetric {
  name: string;
  value: number;
}

export function useResumoPage() {
  const api = useApi();

  const [viewChatsNovos, setViewChatsNovos] = useState<ViewType>('weekly');
  const [viewChatsFechados, setViewChatsFechados] = useState<ViewType>('weekly');
  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);

  const [dataNovos, setDataNovos] = useState<ChatsMetric[]>([]);
  const [dataFechados, setDataFechados] = useState<ChatsMetric[]>([]);
  const [dataConexoes, setDataConexoes] = useState<ConnectionsMetric[]>([]);
  const [dataAtendentes, setDataAtendentes] = useState<ChatsMetric[]>([]);

  // 📊 Buscar chats novos
  useEffect(() => {
    const fetchData = async () => {
      try {
        // CORREÇÃO 1: A tipagem de 'res' foi ajustada para o dado real, não para AxiosResponse
        const res: ChatsMetric[] | null = await api.get(
          `/metrics/chats/novos?period=${viewChatsNovos}`
        );
       
        // CORREÇÃO 2: Usamos 'res || []' para garantir que o estado seja sempre um array
        setDataNovos(res || []);
      } catch (err) {
        console.error('Erro ao carregar chats novos:', err);
        setDataNovos([]);
      }
    };
    fetchData();
  }, [viewChatsNovos]);

  // 📊 Buscar chats fechados
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: ChatsMetric[] | null = await api.get(
          `/metrics/chats/fechados?period=${viewChatsFechados}`
        );
        // CORREÇÃO 3: Chamando o setter correto -> setDataFechados
        setDataFechados(res || []);
      } catch (err) {
        console.error('Erro ao carregar chats fechados:', err);
        setDataFechados([]);
      }
    };
    fetchData();
  }, [viewChatsFechados]);

  // 📊 Buscar chats por atendente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: ChatsMetric[] | null = await api.get(
          '/metrics/chats/atendentes'
        );
        // CORREÇÃO 3: Chamando o setter correto -> setDataAtendentes
        setDataAtendentes(res || []);
      } catch (err) {
        console.error('Erro ao carregar atendentes:', err);
        setDataAtendentes([]);
      }
    };
    fetchData();
  }, []);

  // 📊 Buscar chats por conexões
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: ConnectionsMetric[] | null = await api.get(
          '/metrics/chats/conexoes'
        );
        // CORREÇÃO 3: Chamando o setter correto -> setDataConexoes
        setDataConexoes(res || []);
      } catch (err) {
        console.error('Erro ao carregar conexões:', err);
        setDataConexoes([]);
      }
    };
    fetchData();
  }, []);

  // Essas linhas agora funcionarão, pois o estado inicial é um array vazio
  // e será preenchido corretamente pela API.
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
    widthConexoes,
  };
}