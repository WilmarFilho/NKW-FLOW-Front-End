import { Connection } from './connection';

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
  ultima_mensagem: string,
  connection: Connection;
}