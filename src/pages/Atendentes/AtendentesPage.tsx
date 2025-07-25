import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Attendant, AttendantInput } from '../../types/attendant';
import { useAttendants } from '../../hooks/useAttendants';
import GenericTable from '../../components/Gerais/Tables/GenericTable';
import Button from '../../components/Gerais/Buttons/Button';
import Modal from '../../components/Gerais/Modal/Modal';
import AttendantForm from '../../components/Atendentes/AttendantForm';

import './atendentes.css';

import ArrowUp from './assets/arrow-circle.svg';
import XCheck from './assets/x-circle.svg';


export default function AtendentesPage() {
  const { attendants, loading, error, addAttendant, removeAttendant } = useAttendants();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return '';
  }

  if (error) {
    return <div className="feedback-message error">Erro ao carregar: {error}</div>;
  }

  const handleDelete = async (id: string) => {
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
      setIsModalOpen(false);
    } catch (error) {
      alert('Não foi possível cadastrar o atendente.');
      throw error;
    }
  };

  return (
    <div className="connections-container">



      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className="connections-header"


      >

        
          <div>
            <h2>Seus atendentes</h2>
            <h3>Verifique seus atendentes atuais, adicione ou desative…</h3>
          </div>

          <Button label="Adicionar Atendente" onClick={() => setIsModalOpen(true)} />


        
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className="generic-table"


      >
        <GenericTable<Attendant>
          columns={['Nome', 'Email', 'Status', 'Ações']}
          data={attendants}
          renderRow={(conn, i) => (
            <div className="connection-row" key={i}>
              <div>{conn.user.nome}</div>
              <div>{conn.user.email}</div>
              <div
                className={`status-chip ${conn.status ? 'active' : 'inactive'}`}
              >
                {conn.status ? 'Ativado' : 'Desativado'}
              </div>
              <div className='box-icons-table'>
                <button className="edit-button" ><ArrowUp  /></button>
                <button className="delete-button" onClick={() => handleDelete(conn.id)}><XCheck  /></button>
              </div>
            </div>
          )}
        />
      </motion.div>




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