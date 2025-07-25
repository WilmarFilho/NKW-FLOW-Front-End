import { Connection } from './connection';

export interface Chat {
  id: string;
  connection_id: string;
  contato_nome: string;
  contato_numero: string;
  ia_ativa: boolean;
  foto_perfil?: string;
  ultima_atualizacao: string;
  connection: Connection;
}



