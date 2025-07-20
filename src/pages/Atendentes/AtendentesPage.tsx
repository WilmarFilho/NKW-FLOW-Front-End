import { useState } from 'react';
import type { Attendant, AttendantInput } from '../../types/attendant';
import { useAttendants } from '../../hooks/useAttendants';
import GenericTable from '../../components/Gerais/Tables/GenericTable';
import Button from '../../components/Gerais/Buttons/Button';
import Modal from '../../components/Gerais/Modal/Modal';
import AttendantForm from '../../components/Atendentes/AttendantForm';

import './atendentes.css';

export default function AtendentesPage() {
  const { attendants, loading, error, addAttendant, removeAttendant } = useAttendants();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return <div className="feedback-message">Carregando atendentes...</div>;
  }

  if (error) {
    return <div className="feedback-message error">Erro ao carregar: {error}</div>;
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este atendente?')) {
      try {
        await removeAttendant(id);
      } catch (error) {
        alert('Não foi possível excluir o atendente.' + error);
      }
    }
  };

  const handleSaveAttendant = async (data: AttendantInput) => {
    try {
      await addAttendant(data);
      setIsModalOpen(false); // Fecha o modal em caso de sucesso
    } catch (error) {
      alert('Não foi possível cadastrar o atendente.');
      // Não fechamos o modal para o usuário poder corrigir os dados
      throw error; // Propaga o erro para o formulário saber que falhou
    }
  };

  return (
    <div className="connections-container">

      <div className="connections-header">
        <h2>Seus atendentes</h2>
        <h3>Verifique seus atendentes atuais, adicione ou desative…</h3>
      </div>

      <GenericTable<Attendant>
        columns={['Nome', 'Email', 'Status', 'Ações']}
        data={attendants}
        renderRow={(conn, i) => (
          <div className="connection-row" key={i}>
            <div>{conn.nome}</div>
            <div>{conn.email}</div>
            <div className="agent-select">{conn.ativo}</div>
            <div>
              <button className="delete-button" onClick={() => handleDelete(conn.id)}>Excluir</button>
            </div>
          </div>
        )}
      />

      <div className="button-container">
        <Button label="Adicionar Atendente" onClick={() => setIsModalOpen(true)} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cadastrar Novo Atendente"
      >
        <AttendantForm
          onSave={handleSaveAttendant}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}