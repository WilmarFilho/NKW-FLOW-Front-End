export interface Attendant {
  id: string;
  status: boolean;
  user_id: string;
  user_admin_id: string;
}

export interface AttendantInput {
  nome: string;
  email: string;
  senha: string;
}
