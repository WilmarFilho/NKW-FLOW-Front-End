// Libbs
import { useState } from 'react';
import { motion } from 'framer-motion';
// Components
import GenericTable from '../../components/Gerais/Tables/GenericTable';
import Button from '../../components/Gerais/Buttons/Button';
import Modal from '../../components/Gerais/ModalForm/Modal';
import AttendantForm from '../../components/Atendentes/AttendantForm';
// Types
import type { Attendant, AttendantInput } from '../../types/attendant';
// Hooks
import { useAttendants } from '../../hooks/attendants/useAttendants';
// Css
import './atendentes.css';
// Assets
import ArrowUp from './assets/arrow-circle.svg';
import XCheck from './assets/x-circle.svg';


export default function AtendentesPage() {
  const { attendants, addAttendant, removeAttendant, editAttendant } = useAttendants();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editData, setEditData] = useState<Partial<AttendantInput> | null>(null);
  const [editAttendantId, setEditAttendantId] = useState<string | null>(null);
  const [editUserId, setEditUserId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este atendente?')) {
      try {
        await removeAttendant(id);
      } catch (error) {
        alert('Não foi possível excluir o atendente.' + error);
      }
    }
  };

  const handleEdit = (attendant: Attendant) => {
    setEditAttendantId(attendant.id);
    setEditUserId(attendant.user.id);
    setEditData({
      nome: attendant.user.nome,
      email: attendant.user.email,
      status: attendant.status,
      numero: attendant.numero
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditAttendantId(null);
    setEditUserId(null);
    setEditData(null);
    setIsModalOpen(true);
  }


  const handleSaveAttendant = async (data: AttendantInput) => {
    try {
      if (editAttendantId) {
        await editAttendant(editAttendantId, editUserId, data);
      } else {
        await addAttendant(data);
      }

      setIsModalOpen(false);
      setEditAttendantId(null);
      setEditData(null);
    } catch (error) {
      alert('Não foi possível salvar o atendente.');
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
        <Button label="Adicionar Atendente" onClick={() => handleAdd()} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className="generic-table"
      >
        <GenericTable<Attendant>
          columns={['Nome', 'Email', 'Número', 'Status']}
          data={attendants}
          renderRow={(conn, i) => (
            <div className="connection-row" key={i}>
              <div className='box-table-nome'>
                {conn.user.nome}
                <button className="edit-button" onClick={() => handleEdit(conn)} ><ArrowUp /></button>
                <button className="delete-button" onClick={() => handleDelete(conn.id)}><XCheck /></button>
              </div>
              <div>{conn.user.email}</div>
              <div>{conn.numero}</div>
              <div
                className={`status-chip ${conn.status ? 'active' : 'inactive'}`}
              >
                {conn.status ? 'Ativado' : 'Desativado'}
              </div>
              
            </div>
          )}
        />
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editAttendantId ? 'Editar Atendente' : 'Cadastrar Novo Atendente'}
      >
        <AttendantForm
          onSave={handleSaveAttendant}
          onClose={() => {
            setIsModalOpen(false);
            setEditAttendantId(null);
            setEditData(null);
          }}
          initialData={editData}
          editMode={!!editAttendantId}
        />
      </Modal>

    </div>
  );
}