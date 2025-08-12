// Libs
import { motion } from 'framer-motion';
// Components
import Button from '../../components/Gerais/Buttons/Button';
import GenericTable from '../../components/Gerais/Tables/GenericTable';
import Modal from '../../components/Gerais/Modal/Modal';
import AttendantForm from '../../components/Atendentes/AttendantForm';
// Hooks
import { useAttendantsPage } from '../../hooks/attendants/useAttendantsPage';
import { validateAttendantForm } from '../../hooks/utils/useValidator';
// Css e Assets
import PageStyles from '../PageStyles.module.css';
import tableStyles from '../../components/Gerais/Tables/TableStyles.module.css';
import EditIcon from './assets/arrow-circle.svg';
import DeleteIcon from './assets/x-circle.svg';
// Type
import { Attendant, AttendantFormData } from '../../types/attendant';
import { useState } from 'react';

type Column = 'Nome' | 'Email' | 'Número' | 'Status';

const fieldMap: Record<Column, 'nome' | 'email' | 'numero' | 'status'> = {
  Nome: 'nome',
  Email: 'email',
  Número: 'numero',
  Status: 'status',
};

export default function AtendentesPage() {

  const {
    attendants,
    isModalOpen,
    editData,
    isSubmitting,
    showErrors,
    openModal,
    closeModal,
    handleSave,
    handleDelete,
    handleEdit,
    handleStatusToggle,
    setSortField,
    setSortOrder,
    sortField,
    sortOrder,
    activeFilter,
    setActiveFilter,
    setShowErrors
  } = useAttendantsPage();

  const [formData, setFormData] = useState<AttendantFormData | null>(null);

  const handleFormChange = (data: AttendantFormData) => {
    setFormData(data);
  };

  const handleModalSaveClick = async () => {
    setShowErrors(true);

    if (!formData) return;

    const foundErrors = validateAttendantForm(formData, !!editData);
    if (Object.keys(foundErrors).length > 0) return;

    await handleSave(formData);
  };

  const renderRow = (attendant: Attendant) => (
    <div key={attendant.id} className={tableStyles.tableRow} style={{ gridTemplateColumns: '1fr 2fr 2fr 2fr 1fr' }}>
      <div data-label="Status" onClick={() => handleStatusToggle(attendant)} className={tableStyles.clickableStatus}>
        <span className={`${tableStyles.statusChip} ${attendant.user.status ? tableStyles.active : tableStyles.inactive}`}>
          {attendant.user.status ? 'Ativo' : 'Inativo'}
        </span>
      </div>
      <div data-label="Nome" onClick={() => handleEdit(attendant)}>{attendant.user.nome}</div>
      <div data-label="Email" onClick={() => handleEdit(attendant)}>{attendant.user.email}</div>
      <div data-label="Número" onClick={() => handleEdit(attendant)}>{attendant.user.numero}</div>
      <div className={tableStyles.actionCell}>
        <button className={tableStyles.actionButtonEdit} onClick={() => handleEdit(attendant)}><EditIcon /></button>
        <button className={tableStyles.actionButtonDelete} onClick={() => handleDelete(attendant.id)}><DeleteIcon /></button>
      </div>
    </div>
  );

  return (
    <div className={PageStyles.container}>
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={PageStyles.containerHeader}>
        <div className={PageStyles.headerTitles}>
          <h2>Seus atendentes humanos</h2>
          <h3>Cadastre e gerencie os atendentes que podem interagir com seus clientes.</h3>
        </div>
        <Button label="Adicionar Atendente" onClick={openModal} />
      </motion.header>

      <div className={PageStyles.containerContent}>
        <GenericTable
          columns={['Status', 'Nome', 'Email', 'Número', '']}
          data={attendants}
          renderRow={renderRow}
          gridTemplateColumns="1fr 2fr 2fr 2fr 1fr"
          onSortClick={(col) => {
            if ((['Nome', 'Email', 'Número', 'Status'] as Column[]).includes(col as Column)) {
              const selectedField = fieldMap[col as Column];
              if (selectedField === sortField) {
                setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
              } else {
                setSortField(selectedField);
                setSortOrder('asc');
              }
            }
          }}
          sortField={sortField}
          sortOrder={sortOrder}
        />

        <div className={PageStyles.containerBottom}>
          <button className={`${PageStyles.buttonBase} ${activeFilter === 'ativo' ? PageStyles.activeFilter : ''}`} onClick={() => setActiveFilter('ativo')}>
            Ver atendentes ativos
          </button>
          <button className={`${PageStyles.buttonBase} ${activeFilter === 'inativo' ? PageStyles.activeFilter : ''}`} onClick={() => setActiveFilter('inativo')}>
            Ver atendentes inativos
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editData ? 'Editar Atendente' : 'Cadastrar Novo Atendente'}
        labelSubmit={editData ? 'Editar Atendente' : 'Cadastrar Atendente'}
        isSubmitting={isSubmitting}
        onSave={handleModalSaveClick}
      >
        <AttendantForm
          initialData={editData || undefined}
          editMode={!!editData}
          onChange={handleFormChange}
          isSubmitting={isSubmitting}
          triggerValidation={showErrors}
        />
      </Modal>
    </div>
  );
}


