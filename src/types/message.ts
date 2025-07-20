export interface Message {
  id: string;
  chat_id: string;
  remetente: string;
  mensagem: string;
  mimetype: string;
  base64: string;
  transcricao: string;
  criado_em: string;
}