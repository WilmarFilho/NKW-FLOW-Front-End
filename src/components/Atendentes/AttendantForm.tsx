//Libbs
import { useState } from 'react';
//Types
import type { AttendantInput } from '../../types/attendant';

interface AttendantFormProps {
  onSave: (data: AttendantInput) => Promise<void>; // Recebe a função de salvar
  onClose: () => void;
  initialData: Partial<AttendantInput> | null;
  editMode?: boolean;
}

export default function AttendantForm({ onSave, onClose, initialData, editMode }: AttendantFormProps) {

  const [formData, setFormData] = useState<AttendantInput>({
    nome: initialData?.nome || '',
    email: initialData?.email || '',
    numero: initialData?.numero || '',
    senha: '', // nunca mostra senha anterior
    status: initialData?.status ?? true,
    user_id: initialData?.user_id ?? '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose()
    } catch (error) {
      console.error('Erro no formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="attendant-form">
      <div className="form-group">
        <label htmlFor="nome">Nome</label>
        <input id="nome" placeholder="Nome completo" value={formData.nome} onChange={handleInputChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" placeholder="email@exemplo.com" value={formData.email} onChange={handleInputChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="numero">Número</label>
        <input id="numero" type="number" placeholder="6499999999" value={formData.numero} onChange={handleInputChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="senha">Senha</label>
        <input id="senha" type="password" placeholder="Mínimo 6 caracteres" value={formData.senha} onChange={handleInputChange} required />
      </div>
      {editMode && (
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={formData.status ? 'ativo' : 'inativo'}
            onChange={(e) =>
              setFormData(prev => ({
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

      <div className="form-actions">
        <button type="submit" className="submit-button">
          {isSubmitting ? 'Salvando...' : editMode ? 'Atualizar' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}