import { atom } from 'recoil';

import type { Connection } from '../types/connection';
import type { Attendant } from '../types/attendant';
import type { Agent } from '../types/agent';
import type { HelpChat } from '../types/helpChat';
import type { Chat, ChatFilters } from '../types/chats';
import type { Message } from '../types/message';
import type { User } from '../types/user';
import type { MetricsState } from '../types/metric';

const KEYS = {
  CONNECTIONS: 'connectionsState',
  ACTIVE_CHAT: 'activeChatState',
  METRICS: 'metricsState',
  CHATS: 'chatsState',
  MESSAGES: 'messagesState',
  ADD_CONN_MODAL: 'addConnectionModalState',
  ATTENDANTS: 'attendantsState',
  AGENTS: 'agentsState',
  HELP_CHAT: 'helpChat',
  USER: 'userState',
  AUTH_TOKEN: 'authTokenState',
  NEXT_CURSOR: 'nextCursorState',
  CHAT_FILTERS: 'chatFiltersState',
};

const localStorageEffect =
  <T,>(key: string) =>
  ({ onSet }: { onSet: (callback: (newValue: T) => void) => void }) => {
    onSet((newValue) => {
      try {
        if (newValue === null || newValue === undefined) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(newValue));
        }
      } catch {
        // silent
      }
    });
  };

const readLocalStorage = <T,>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

export const connectionsState = atom<Connection[]>({
  key: KEYS.CONNECTIONS,
  default: [],
});

export const activeChatState = atom<Chat | null>({
  key: KEYS.ACTIVE_CHAT,
  default: null,
});

export const metricsState = atom<MetricsState>({
  key: KEYS.METRICS,
  default: {
    novos: null,
    fechados: null,
    atendentes: [],
    conexoes: [],
  },
});

export const chatsState = atom<Chat[]>({
  key: KEYS.CHATS,
  default: [],
});

export const messagesState = atom<Record<string, Message[]>>({
  key: KEYS.MESSAGES,
  default: {},
});

export const addConnectionModalState = atom<{ isOpen: boolean; editMode?: boolean }>({
  key: KEYS.ADD_CONN_MODAL,
  default: { isOpen: false, editMode: false },
});

export const attendantsState = atom<Attendant[]>({
  key: KEYS.ATTENDANTS,
  default: [],
});

export const agentsState = atom<Agent[]>({
  key: KEYS.AGENTS,
  default: [],
});

export const helpChatState = atom<HelpChat[]>({
  key: KEYS.HELP_CHAT,
  default: [],
});

export const userState = atom<User | null>({
  key: KEYS.USER,
  default: null,
});

export const authTokenState = atom<{ token: string; userId: string } | null>({
  key: KEYS.AUTH_TOKEN,
  default: (() => readLocalStorage<{ token: string; userId: string }>(KEYS.AUTH_TOKEN))(),
  effects_UNSTABLE: [localStorageEffect<{ token: string; userId: string } | null>(KEYS.AUTH_TOKEN)],
});

export const nextCursorState = atom<string | null>({
  key: KEYS.NEXT_CURSOR,
  default: null,
});

export const chatFiltersState = atom<ChatFilters>({
  key: KEYS.CHAT_FILTERS,
  default: {
    search: '',
    connection_id: undefined,
    attendant_id: undefined,
    iaStatus: 'todos',
    status: 'Open',
    owner: 'all',
  } as ChatFilters,
});