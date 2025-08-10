import { useState } from 'react';
// Tipos
import type { AttendantFormData } from '../../types/attendant';
// Css
import formStyles from '../Gerais/ModalForm/ModalForm.module.css';

interface AttendantFormProps {
  onSave: (data: AttendantFormData) => Promise<void>;
  onClose: () => void;
  initialData?: Partial<AttendantFormData>;
  editMode?: boolean;
}

export default function AttendantForm({
  onSave,
  onClose,
  initialData,
  editMode = false,
}: AttendantFormProps) {

  const [formData, setFormData] = useState<AttendantFormData>({
    nome: initialData?.nome || '',
    email: initialData?.email || '',
    numero: initialData?.numero || '',
    senha_hash: '', // Senha é sempre resetada por segurança
    status: initialData?.status ?? true,
    user_id: initialData?.user_id ?? '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
      console.error('Erro ao salvar atendente:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={formStyles.formContainer}>
      <div className={formStyles.formGroup}>
        <label htmlFor="nome">Nome</label>
        <input
          id="nome"
          className={formStyles.formInput}
          placeholder="Nome completo"
          value={formData.nome}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className={formStyles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className={formStyles.formInput}
          placeholder="email@exemplo.com"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className={formStyles.formGroup}>
        <label htmlFor="numero">Número de Telefone</label>
        <input
          id="numero"
          type="tel" 
          className={formStyles.formInput}
          placeholder="64999999999"
          value={formData.numero}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className={formStyles.formGroup}>
        <label htmlFor="senha">Senha</label>
        <input
          id="senha_hash"
          type="password"
          className={formStyles.formInput}
          placeholder={editMode ? 'Deixe em branco para não alterar' : 'Mínimo 6 caracteres'}
          value={formData.senha_hash}
          onChange={handleInputChange}
          required={!editMode}
        />
      </div>
      {editMode && (
        <div className={formStyles.formGroup}>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            className={formStyles.formSelect}
            value={formData.status ? 'ativo' : 'inativo'}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                status: e.target.value === 'ativo',
              }))
            }
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Desativado</option>
          </select>
        </div>
      )}

      {/* Exibe uma mensagem de erro, se houver */}
      {error && <div className={formStyles.errorText}>{error}</div>}

      <div className={formStyles.formActions}>
        <button
          type="submit"
          className={formStyles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : editMode ? 'Atualizar Atendente' : 'Criar Atendente'}
        </button>
      </div>
    </form>
  );
}