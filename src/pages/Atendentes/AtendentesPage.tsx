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
import PageStyles from '../PageStyles.module.css';
import tableStyles from '../../components/Gerais/Tables/TableStyles.module.css'
// Assets
import EditIcon from './assets/arrow-circle.svg';
import DeleteIcon from './assets/x-circle.svg';



export default function AtendentesPage() {

  const { attendants, addAttendant, removeAttendant, editAttendant } = useAttendants();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editData, setEditData] = useState<Partial<AttendantInput> | null>(null);
  const [editAttendantId, setEditAttendantId] = useState<string | null>(null);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza?')) {
      await removeAttendant(id).catch(err => alert('Falha ao excluir: ' + err));
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

  const handleSave = async (data: AttendantInput) => {
    if (editAttendantId) {
      await editAttendant(editAttendantId, editUserId, data);
    } else {
      await addAttendant(data);
    }
    closeModal();
  };

  const openModal = () => {
    setEditAttendantId(null)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditAttendantId(null);
    setIsModalOpen(false);
  };

  const renderAttendantRow = (attendant: Attendant) => (
    <div
      key={attendant.id}
      className={tableStyles.tableRow}
      style={{ gridTemplateColumns: '2fr 3fr 2fr 1fr 1fr' }}
    >
      <div data-label="Nome" className={tableStyles.cellName}>
        <span>{attendant.user.nome}</span>
      </div>
      <div data-label="Email">{attendant.user.email}</div>
      <div data-label="Número">{attendant.numero}</div>
      <div data-label="Status">
        <span className={`${tableStyles.statusChip} ${attendant.status ? tableStyles.active : tableStyles.inactive}`}>
          {attendant.status ? 'Ativo' : 'Inativo'}
        </span>
      </div>
      <div className={tableStyles.actionCell}>
        <button className={tableStyles.actionButton} onClick={() => handleEdit(attendant)} aria-label="Editar">
          <EditIcon />
        </button>
        <button className={tableStyles.actionButton} onClick={() => handleDelete(attendant.id)} aria-label="Deletar">
          <DeleteIcon />
        </button>
      </div>
    </div>
  );


  return (
      <div  className={PageStyles.container}>
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={PageStyles.containerHeader}
        >
          <div  className={PageStyles.headerTitles}>
            <h2>Seus atendentes humanos</h2>
            <h3>Cadastre e gerencie os atendentes que podem interagir com seus clientes.</h3>
          </div>
          <Button label="Adicionar Atendente" onClick={() => openModal()} />
        </motion.header>


        <GenericTable<Attendant>
          columns={['Nome', 'Email', 'Número', 'Status', '']}
          data={attendants}
          renderRow={renderAttendantRow}
          gridTemplateColumns="2fr 3fr 2fr 1fr 1fr"
        />


        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editAttendantId ? 'Editar Atendente' : 'Cadastrar Novo Atendente'}
        >
          <AttendantForm
            onSave={handleSave}
            onClose={closeModal}
            initialData={editData ? {
              nome: editData.nome,
              email: editData.email,
              status: editData.status,
              numero: editData.numero
            } : null}
            editMode={!!editData}
          />
        </Modal>
      </div>
  );
}
