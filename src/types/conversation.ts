export interface Contact {
  id: string;
  name: string;
  phone: string;
  botEnabled: boolean;
  avatar?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'document' ;
  sender: 'user' | 'contact' | 'agent' | 'atendente';
  timestamp: string;
  isFromBot?: boolean;
  metadata?: {
    fileName?: string;
    mimeType?: string;
  };
}

