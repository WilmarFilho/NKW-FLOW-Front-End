import { atom } from 'recoil';
import type { Connection } from '../types/connection'; 

export const connectionsState = atom<Connection[]>({
  key: 'connectionsState', 
  default: [],
});

// Átomo para controlar a visibilidade do modal
export const addConnectionModalState = atom<{ isOpen: boolean }>({
    key: 'addConnectionModalState',
    default: {
        isOpen: false,
    },
});