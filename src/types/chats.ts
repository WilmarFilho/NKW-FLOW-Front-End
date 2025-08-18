import { Agent } from './agent';

export interface Chat {
  status: string;
  user_id: string;
  connection_id: string;
  contato_nome: string;
  contato_numero: string;
  foto_perfil?: string;
  id: string;
  ia_ativa: boolean;
  ultima_atualizacao: string;
  mensagem_data?: string | null;
  ultima_mensagem: string,
  connection: {
    agente: Agent,
    agente_id: string,
    id: string,
    nome: string
  };
  unread_count: number;
}