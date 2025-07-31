import { atom } from 'recoil';
import type { Connection } from '../types/connection';
import type { Attendant } from '../types/attendant';
import type { Agent } from '../types/agent';
import type { HelpChat } from '../types/helpChat';
import { Chat } from '../types/chats';
import { Message } from '../types/message';
import { User } from '../types/user';

// Estado das conexões WhatsApp
export const connectionsState = atom<Connection[]>({
  key: 'connectionsState',
  default: [],
});

// Estado dos chats WhatsApp
export const chatsState = atom<Chat[]>({
  key: 'chatsState',
  default: [],
});

// Estado das mensagens WhatsApp
export const messagesState = atom<Message[]>({
  key: 'messagesState',
  default: [],
});

// Controle do modal de adicionar conexão
export const addConnectionModalState = atom<{
  isOpen: boolean;
  initialData: Partial<Connection> | null;
  editMode?: boolean;
}>({
  key: 'addConnectionModalState',
  default: { isOpen: false, initialData: null, editMode: false },
});

// Estado dos atendentes humanos
export const attendantsState = atom<Attendant[]>({
  key: 'attendantsState',
  default: [],
});

// Estado dos agents IA
export const agentsState = atom<Agent[]>({
  key: 'agentsState',
  default: [],
});

// Chat da Pagina de Ajuda
export const helpChatState = atom<HelpChat[]>({
  key: 'helpChatState',
  default: [],
});

// Autenticação


export const userState = atom<User>({
  key: 'userState',
  default: {
    id: 'mock-id',
    email: 'mock@email.com',
    nome: 'Mock User',
    tipo_de_usuario: 'admin',
    foto_perfil: '',
    status: true,
    modo_tela: 'Black',
    modo_side_bar: 'Full',
    mostra_nome_mensagens: true,
    modo_notificacao_atendente: false,
    notificacao_para_entrar_conversa: true,
    notificacao_necessidade_de_entrar_conversa: false,
    notificacao_novo_chat: true,
    criado_em: new Date().toISOString(),
  },
});


export const authTokenState = atom<string | null>({
  key: 'authTokenState',
  default: localStorage.getItem('token'),
  effects: [
    ({ onSet }) => {
      onSet((token) => {
        if (token) localStorage.setItem('token', token);
        else localStorage.removeItem('token');
      });
    },
  ],
});