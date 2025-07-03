import { useState } from 'react';
import type { Attendant, AttendantInput } from '../../types/attendant';
import { useAttendants } from '../../hooks/useAttendants';
import GenericTable from '../../components/Gerais/Tables/GenericTable';
import Button from '../../components/Gerais/Buttons/Button';
import Modal from '../../components/Gerais/Modal/Modal';
import AttendantForm from '../../components/Atendentes/AttendantForm';

import './atendentes.css';

export default function AtendentesPage() {
  const { attendants, loading, addAttendant, removeAttendant } = useAttendants();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este atendente?')) {
      try {
        await removeAttendant(id);
      } catch (error) {
        alert('Não foi possível excluir o atendente.');
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

  const renderAttendantRow = (attendant: Attendant) => (
    <div className="table-row" key={attendant.id}>
      <div>{attendant.id}</div>
      <div>{attendant.nome}</div>
      <div>{attendant.email}</div>
      <div>{attendant.ativo ? 'Ativo' : 'Inativo'}</div>
      <div>
        <button className="delete-button" onClick={() => handleDelete(attendant.id)}>Excluir</button>
      </div>
    </div>
  );

  if (loading) {
    return <div className="atendentes-container"><h2>Carregando atendentes...</h2></div>;
  }

  return (
    <div className="connections-container">

      <div className="connections-header">
        <h2>Seus atendentes</h2>
        <h3>Verifique seus atendentes atuais, adicione ou desative…</h3>
      </div>

      <GenericTable<Attendant>
        columns={['ID', 'Nome', 'Email', 'Status', 'Ações']}
        data={attendants}
        renderRow={renderAttendantRow}
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