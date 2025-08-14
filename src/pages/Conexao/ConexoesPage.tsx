// Libs
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
// Components
import Button from '../../components/Gerais/Buttons/Button';
import ConnectionForm from '../../components/Conexoes/ConnectionForm';
import GenericTable from '../../components/Gerais/Tables/GenericTable';
// Hooks
import { useConnectionsPage } from '../../hooks/connections/useConnectionsPage';
import { validateConnectionForm } from '../../hooks/utils/useValidator'
// Css e Assets
import GlobalStyles from '../../global.module.css';
import TableStyles from '../../components/Gerais/Tables/TableStyles.module.css';
import EditIcon from './assets/arrow-circle.svg';
import DeleteIcon from './assets/x-circle.svg';
// Type
import { Connection } from '../../types/connection';
import Modal from '../../components/Gerais/Modal/Modal';
import { useAddConnection } from '../../hooks/connections/useAddConnection';

export default function ConexoesPage() {
  const {
    connections,
    activeFilter,
    sortField,
    sortOrder,
    modalState,
    formData,
    errors,
    showErrors,
    setErrors,
    setFormData,
    setActiveFilter,
    setSortField,
    setSortOrder,
    handleDelete,
    handleStatusToggle,
    handleEdit,
    openModal,
    closeModal,
    fetchConnections,
    setShowErrors,
  } = useConnectionsPage();

  const { handleStartSession, handleEditConnection, isLoading, step, qrCode } = useAddConnection();

  const handleModalSaveClick = async () => {
    const foundErrors = validateConnectionForm(formData);
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      setShowErrors(true);
      return;
    }

    setErrors({});
    setShowErrors(false);

    if (formData) {
      if (modalState.editMode) {
        await handleEditConnection(formData);
        closeModal();
        fetchConnections();
      } else {
        await handleStartSession(formData);
      }
    }
  };

  const renderConnectionRow = (conn: Connection) => (
    <div
      key={conn.id}
      className={TableStyles.tableRow}
      style={{ gridTemplateColumns: '1fr 2fr 2fr 2fr 1fr' }}
      role="row"
      tabIndex={0}
      aria-label={`Conexão ${conn.nome.split('_')[0]}`}
    >
      <div
        data-label="Status"
        onClick={() => handleStatusToggle(conn)}
        className={TableStyles.clickableStatus}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleStatusToggle(conn)}
        aria-pressed={conn.status}
      >
        <span className={`${TableStyles.statusChip} ${conn.status ? TableStyles.active : TableStyles.inactive}`}>
          {conn.status ? 'Ativo' : 'Inativo'}
        </span>
      </div>

      <div data-label="Nome" onClick={() => handleEdit(conn)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleEdit(conn)}>
        {conn.nome.split('_')[0]}
      </div>

      <div data-label="Número" onClick={() => handleEdit(conn)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleEdit(conn)}>
        {conn.numero || 'N/A'}
      </div>

      <div data-label="Agente">
        <NavLink to="/agentes">{conn.agente?.tipo_de_agente || 'Nenhum'}</NavLink>
      </div>

      <div className={TableStyles.actionCell}>
        <button className={TableStyles.actionButtonEdit} onClick={() => handleEdit(conn)} aria-label="Editar">
          <EditIcon />
        </button>
        <button className={TableStyles.actionButtonDelete} onClick={() => handleDelete(conn.id)} aria-label="Deletar">
          <DeleteIcon />
        </button>
      </div>
    </div>
  );

  return (
    <div className={GlobalStyles.pageContainer}>
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={GlobalStyles.pageHeader}>
        <div className={GlobalStyles.pageHeaderTitles}>
          <h2>Suas conexões do WhatsApp</h2>
          <h3>Verifique, adicione ou desative suas conexões do WhatsApp.</h3>
        </div>
        <Button label="Adicionar Conexão" onClick={() => openModal()} />
      </motion.header>

      <div className={GlobalStyles.pageContent}>
        <GenericTable
          columns={['Status', 'Nome', 'Número', 'Agente', '']}
          data={connections}
          renderRow={renderConnectionRow}
          gridTemplateColumns="1fr 2fr 2fr 2fr 1fr"
          onSortClick={(col) => {
            const fieldMap: Record<string, 'nome'> = { Nome: 'nome' };
            const selectedField = fieldMap[col];
            if (!selectedField) return;

            if (selectedField === sortField) {
              setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
            } else {
              setSortField(selectedField);
              setSortOrder('asc');
            }
          }}
          sortField={sortField}
          sortOrder={sortOrder}
        />

        <div className={GlobalStyles.filterControls}>
          <button
            className={`${GlobalStyles.button} ${activeFilter === 'ativo' ? GlobalStyles.buttonActive : ''}`}
            onClick={() => setActiveFilter('ativo')}
          >
            <span>Ver conexões ativas</span>
          </button>
          <button
            className={`${GlobalStyles.button} ${activeFilter === 'inativo' ? GlobalStyles.buttonActive : ''}`}
            onClick={() => setActiveFilter('inativo')}
          >
            <span>Ver conexões inativas</span>
          </button>
        </div>
      </div>

      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.editMode ? 'Editar Conexão' : 'Cadastrar Conexão'}
        labelSubmit={modalState.editMode ? 'Salvar Alterações' : 'Gerar QR Code'}
        isSubmitting={isLoading}
        onSave={handleModalSaveClick}
        step={step}
      >
        <ConnectionForm
          onChange={setFormData}
          formData={formData}
          editMode={modalState.editMode}
          step={step}
          qrCode={qrCode}
          errors={errors}
          showErrors={showErrors}
        />
      </Modal>
    </div>
  );
}