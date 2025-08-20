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

export const messagesState = atom<Record<string, Message[]>>({
  key: 'messagesState',
  default: {},
});

// Controle do modal de adicionar nova conversa
export const addConnectionModalState = atom<{
  isOpen: boolean;
  editMode?: boolean;
}>({
  key: 'addConnectionModalState',
  default: { isOpen: false, editMode: false },
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

export const userState = atom<User | null>({
  key: 'userState',
  default: null,
});

export const authTokenState = atom<{ token: string; userId: string } | null>({
  key: 'authTokenState',
  default: (() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return token && userId ? { token, userId } : null;
  })(),
  effects: [
    ({ onSet }) => {
      onSet((value) => {
        if (value) {
          localStorage.setItem('token', value.token);
          localStorage.setItem('userId', value.userId);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
        }
      });
    },
  ],
});