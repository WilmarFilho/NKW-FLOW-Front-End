import { Agent } from './agent';

export interface Chat {
  status: string;
  user_id: string | null;
  connection_id: string;
  contato_nome: string;
  contato_numero: string;
  foto_perfil?: string;
  id: string;
  ia_ativa: boolean;
  ultima_atualizacao: string;
  mensagem_data?: string | null;
  ultima_mensagem_type?: string;
  ultima_mensagem: string,
  connection: {
    agente: Agent,
    agente_id: string,
    id: string,
    nome: string
  };
  unread_count: number;
  ia_desligada_em?: string | null;
  user_nome?: string | null;
}

export interface ChatFilters {
  search?: string | null;
  connection_id?: string | null;
  attendant_id?: string | null;
  iaStatus?: 'todos' | 'ativa' | 'desativada';
  status?: 'Open' | 'Close';
  owner?: string;
  isFetching?: boolean;
}
