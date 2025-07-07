import { atom } from 'recoil';
import type { Connection } from '../types/connection';
import type { Attendant } from '../types/attendant';
import type { Agent } from '../types/agent';
import type { HelpChat } from '../types/helpChat';

// Estado das conexões WhatsApp
export const connectionsState = atom<Connection[]>({
  key: 'connectionsState',
  default: [],
});

// Controle do modal de adicionar conexão
export const addConnectionModalState = atom({
  key: 'addConnectionModalState',
  default: { isOpen: false },
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
  key: "helpChatState",
  default: [],
});
