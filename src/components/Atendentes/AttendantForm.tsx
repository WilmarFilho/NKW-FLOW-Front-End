// Libs
import { useState, useEffect } from 'react';
// Types
import type { AttendantFormData } from '../../types/attendant';
// Css
import formStyles from '../Gerais/Form/form.module.css';

interface AttendantFormProps {
  initialData?: Partial<AttendantFormData>;
  editMode?: boolean;
  onChange: (data: AttendantFormData) => void;
  isSubmitting: boolean;
}

export default function AttendantForm({
  initialData,
  editMode = false,
  onChange,
  isSubmitting,
}: AttendantFormProps) {
  const [formData, setFormData] = useState<AttendantFormData>({
    nome: initialData?.nome || '',
    email: initialData?.email || '',
    numero: initialData?.numero || '',
    senha_hash: '',
    status: initialData?.status ?? true,
    user_id: initialData?.user_id ?? '',
  });

  useEffect(() => {
    setFormData({
      nome: initialData?.nome || '',
      email: initialData?.email || '',
      numero: initialData?.numero || '',
      senha_hash: '',
      status: initialData?.status ?? true,
      user_id: initialData?.user_id ?? '',
    });
  }, [initialData]);

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <form className={formStyles.formContainer} onSubmit={e => e.preventDefault()}>
      <div className={formStyles.formRow}>

        <div className={formStyles.formGroup}>
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            value={formData.nome}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className={formStyles.formGroup}>
          <label htmlFor="numero">Número</label>
          <input
            id="numero"
            type="tel"
            value={formData.numero}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </div>

      </div>

      <div className={formStyles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className={formStyles.formGroup}>
        <label htmlFor="senha_hash">Senha</label>
        <input
          id="senha_hash"
          type="password"
          placeholder={editMode ? 'Deixe em branco para não alterar' : 'Mínimo 6 caracteres'}
          value={formData.senha_hash}
          onChange={handleInputChange}
          disabled={isSubmitting}
          required={!editMode}
        />
      </div>

      {editMode && (
        <div className={formStyles.formGroup}>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={formData.status ? 'ativo' : 'inativo'}
            onChange={handleInputChange}
            disabled={isSubmitting}
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      )}
    </form>
  );
}