// Libs
import { useState, useEffect } from 'react';
// Types
import type { AttendantFormData } from '../../types/attendant';
// Hooks
import { validateAttendantForm } from '../../hooks/utils/useValidator';
// Css
import formStyles from '../Gerais/Form/form.module.css';

interface AttendantFormProps {
  initialData?: Partial<AttendantFormData>;
  editMode?: boolean;
  onChange: (data: AttendantFormData) => void;
  isSubmitting: boolean;
  triggerValidation?: boolean;
}

export default function AttendantForm({
  initialData,
  editMode = false,
  onChange,
  isSubmitting,
  triggerValidation = false
}: AttendantFormProps) {
  const [formData, setFormData] = useState<AttendantFormData>({
    nome: initialData?.nome || '',
    email: initialData?.email || '',
    numero: initialData?.numero || '',
    senha_hash: '',
    status: initialData?.status ?? true,
    user_id: initialData?.user_id ?? '',
  });

  const [errors, setErrors] = useState<ReturnType<typeof validateAttendantForm>>({});

  useEffect(() => {
    setFormData({
      nome: initialData?.nome || '',
      email: initialData?.email || '',
      numero: initialData?.numero || '',
      senha_hash: '',
      status: initialData?.status ?? true,
      user_id: initialData?.user_id ?? '',
    });
    setErrors({});
  }, [initialData]);

  useEffect(() => {
    onChange(formData);

    if (triggerValidation) {
      setErrors(validateAttendantForm(formData, editMode));
    } else {
      setErrors({});
    }
  }, [formData, triggerValidation, editMode, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    if (id === 'status') {
      setFormData(prev => ({ ...prev, status: value === 'ativo' }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  return (
    <form className={formStyles.formContainer} onSubmit={e => e.preventDefault()}>
      <div className={formStyles.formRow}>
        <div className={formStyles.formGroup}>
          <label htmlFor="nome">Nome:</label>
          <input
            id="nome"
            placeholder='Digite o nome completo do atendente.'
            value={formData.nome}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
          {triggerValidation && errors.nome && (
            <span className={formStyles.errorText}>{errors.nome}</span>
          )}
        </div>

        <div className={formStyles.formGroup}>
          <label htmlFor="numero">Número:</label>
          <input
            id="numero"
            type="tel"
            placeholder='Número para atendente ser notificado.'
            value={formData.numero}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
          {triggerValidation && errors.numero && (
            <span className={formStyles.errorText}>{errors.numero}</span>
          )}
        </div>
      </div>

      <div className={formStyles.formGroup}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          placeholder='Email para atendente ser notificado.'
          value={formData.email}
          onChange={handleInputChange}
          disabled={isSubmitting}
        />
        {triggerValidation && errors.email && (
          <span className={formStyles.errorText}>{errors.email}</span>
        )}
      </div>

      <div className={formStyles.formGroup}>
        <label htmlFor="senha_hash">Senha:</label>
        <input
          id="senha_hash"
          type="password"
          placeholder={editMode ? 'Deixe em branco para não alterar' : 'Mínimo 6 caracteres'}
          value={formData.senha_hash}
          onChange={handleInputChange}
          disabled={isSubmitting}
          required={!editMode}
        />
        {triggerValidation && errors.senha_hash && (
          <span className={formStyles.errorText}>{errors.senha_hash}</span>
        )}
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