import { User } from './user';

export interface Attendant {
  id: string;
  user_id: string;
  user_admin_id: string;
  user: User;
  user_admin: User;
}

export interface AttendantFormData {
  id?: string; // id do atendente, opcional no create
  user_id?: string; // id do user, obrigatório no edit
  nome: string;
  email: string;
  numero: string;
  senha_hash?: string;
  status: boolean;
}
