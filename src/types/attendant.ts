import { User } from './user';

export interface UserAdmin {
  id: string;
  email: string;
  nome: string;
}

export interface Attendant {
  id: string;
  status: boolean;
  numero: string;
  user_id: string;
  user_admin_id: string;
  user: User;
  user_admin: UserAdmin;
}

export interface AttendantInput {
  nome: string;
  email: string;
  numero: string;
  senha: string;
  status: boolean;
  user_id: string;
}
