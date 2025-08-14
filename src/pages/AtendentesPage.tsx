// Libs
import { useState } from 'react';
import { motion } from 'framer-motion';
// Components
import GenericEntityRow from '../components/Gerais/Tables/GenericEntityRow';
import GenericTable from '../components/Gerais/Tables/GenericTable';
import Modal from '../components/Gerais/Modal/Modal';
import AttendantForm from '../components/Atendentes/AttendantForm';
import Button from '../components/Gerais/Buttons/Button';
// Css
import GlobalStyles from '../global.module.css'
import TableStyles from '../components/Gerais/Tables/TableStyles.module.css';
// Hooks
import { useAttendantsPage } from '../hooks/attendants/useAttendantsPage';
import { validateAttendantForm } from '../hooks/utils/useValidator';
// Types
import { Attendant, AttendantFormData } from '../types/attendant';

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
    setShowErrors,
  } = useAttendantsPage();

  const [formData, setFormData] = useState<AttendantFormData | null>(null);

  const handleFormChange = (data: AttendantFormData) => setFormData(data);

  const handleModalSaveClick = async () => {
    setShowErrors(true);
    if (!formData) return;
    const foundErrors = validateAttendantForm(formData, !!editData);
    if (Object.keys(foundErrors).length > 0) return;
    await handleSave(formData);
  };

  const columnTemplate = '1fr 2fr 2fr 2fr 1fr';

  const columns = [
    {
      key: 'user',
      label: 'Status',
      render: (item: Attendant) => (
        <span
          className={`${TableStyles.statusChip} ${item.user.status ? TableStyles.active : TableStyles.inactive
            }`}
          onClick={() => handleStatusToggle(item)} // só status
        >
          {item.user.status ? 'Ativo' : 'Inativo'}
        </span>
      ),
    },
    {
      key: 'user',
      label: 'Nome',
      render: (item: Attendant) => item.user.nome,
      onClick: handleEdit, 
    },
    {
      key: 'user',
      label: 'Email',
      render: (item: Attendant) => item.user.email,
      onClick: handleEdit,
    },
    {
      key: 'user',
      label: 'Número',
      render: (item: Attendant) => item.user.numero,
      onClick: handleEdit,
    },
  ];

  return (
    <div className={GlobalStyles.pageContainer}>
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={GlobalStyles.pageHeader}>
        <div className={GlobalStyles.pageHeaderTitles}>
          <h2>Seus atendentes humanos</h2>
          <h3>Cadastre e gerencie os atendentes que podem interagir com seus clientes.</h3>
        </div>
        <Button label="Adicionar Atendente" onClick={openModal} />
      </motion.header>

      <div className={GlobalStyles.pageContent}>
        <GenericTable
          columns={columns.map(c => c.label || '')}
          data={attendants}
          renderRow={(attendant) => (
            <GenericEntityRow
              key={attendant.id}
              item={attendant}
              columns={columns}
              columnTemplate={columnTemplate}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          gridTemplateColumns={columnTemplate}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortClick={(col) => {
            const fieldMap: Record<string, 'nome' | 'email' | 'numero' | 'status'> = {
              Nome: 'nome',
              Email: 'email',
              Número: 'numero',
              Status: 'status',
            };
            const selectedField = fieldMap[col];
            if (!selectedField) return;
            if (selectedField === sortField) setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
            else { setSortField(selectedField); setSortOrder('asc'); }
          }}
        />

        <div className={GlobalStyles.filterControls}>
          <button
            className={`${GlobalStyles.button} ${activeFilter === 'ativo' ? GlobalStyles.buttonActive : ''}`}
            onClick={() => setActiveFilter('ativo')}
          >
            Ver atendentes ativos
          </button>
          <button
            className={`${GlobalStyles.button} ${activeFilter === 'inativo' ? GlobalStyles.buttonActive : ''}`}
            onClick={() => setActiveFilter('inativo')}
          >
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