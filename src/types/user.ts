export type TipoUsuario = 'admin' | 'atendente';
export type ModoTela = 'Black' | 'White';
export type ModoSidebar = 'Full' | 'Minimal';

export interface User {
  id: string;
  email: string;
  nome: string;
  numero: string;
  tipo_de_usuario: TipoUsuario;
  foto_perfil?: string;
  status: boolean;
  modo_tela: ModoTela;
  modo_side_bar: ModoSidebar;
  mostra_nome_mensagens: boolean;
  modo_notificacao_atendente: boolean;
  notificacao_para_entrar_conversa: boolean;
  notificacao_necessidade_de_entrar_conversa: boolean;
  notificacao_novo_chat: boolean;
  criado_em: string;
}
