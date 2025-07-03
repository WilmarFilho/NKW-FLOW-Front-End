import { atom } from 'recoil';
import type { Connection } from '../types/connection';
import type { Attendant } from '../types/attendant';

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
