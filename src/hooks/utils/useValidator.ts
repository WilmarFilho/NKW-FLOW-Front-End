import { Connection } from '../../types/connection';
import { AttendantFormData } from '../../types/attendant';

export function validateAttendantForm(data: AttendantFormData, editMode = false) {
  const errors: Partial<Record<keyof AttendantFormData, string>> = {};

  if (!data.nome.trim() || data.nome.trim().length < 3) {
    errors.nome = 'O nome deve ter pelo menos 3 caracteres.';
  }
  if (!data.nome.trim() || data.nome.trim().length > 20) {
    errors.nome = 'O nome deve ter no máximo 20 caracteres.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'E-mail inválido.';
  }
  if (!/^\d{10,15}$/.test(data.numero)) {
    errors.numero = 'Número deve ter entre 10 e 15 dígitos.';
  }
  if (!editMode && (!data.password || data.password.length < 6)) {
    errors.password = 'A senha deve ter pelo menos 6 caracteres.';
  }

  if (!data.connection_id) {
    errors.connection_id = 'Selecione uma conexão.';
  }

  return errors;
}

export function validateConnectionForm(data: Partial<Connection> | null) {
  const errors: Partial<Record<keyof Connection, string>> = {};

  if (!data?.nome || data.nome.trim().length < 3) {
    errors.nome = 'O nome da conexão deve ter ao menos 3 caracteres.';
  }

  if (!data?.agente_id || data.agente_id.trim() === '') {
    errors.agente_id = 'Selecione um agente.';
  }

  return errors;
}