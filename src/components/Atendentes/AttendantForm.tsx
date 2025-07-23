import { useState } from 'react';
import type { AttendantInput } from '../../types/attendant';

interface AttendantFormProps {
  onSave: (data: AttendantInput) => Promise<void>; // Recebe a função de salvar
  onClose: () => void;
}

export default function AttendantForm({ onSave, onClose }: AttendantFormProps) {
  const [formData, setFormData] = useState<AttendantInput>({ nome: '', email: '', senha: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData); // Chama a função passada pelo pai
      // O pai (AtendentesPage) será responsável por fechar o modal no sucesso
    } catch (error) {
      // O erro já é tratado no hook, mas podemos mostrar um alerta aqui se quisermos
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
        <label htmlFor="senha">Senha</label>
        <input id="senha" type="password" placeholder="Mínimo 6 caracteres" value={formData.senha} onChange={handleInputChange} required />
      </div>
      <div className="form-actions">
        <button type="submit" className="submit-button">{isSubmitting ? 'Salvando...' : 'Salvar'}</button>
        
        
      </div>
    </form>
  );
}