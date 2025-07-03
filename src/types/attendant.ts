export interface Attendant {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  criado_em?: string;
}

export interface AttendantInput {
  nome: string;
  email: string;
  senha: string;
}
