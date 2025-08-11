// Libs
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
// Components
import Button from '../../components/Gerais/Buttons/Button';
import ConnectionForm from '../../components/Conexoes/ConnectionForm';
import GenericTable from '../../components/Gerais/Tables/GenericTable';
// Hooks
import { useConnectionsPage } from '../../hooks/connections/useConnectionsPage';
// Css e Assets
import PageStyles from '../PageStyles.module.css';
import tableStyles from '../../components/Gerais/Tables/TableStyles.module.css';
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
  } = useConnectionsPage();

  const { handleStartSession, handleEditConnection, isLoading, step, qrCode } = useAddConnection();

  const handleModalSaveClick = async () => {
    if (!formData) return alert('Preencha o formulário');
    if (modalState.editMode) {
      await handleEditConnection(formData);
      closeModal()
      fetchConnections()
    } else {
      await handleStartSession(formData);
    }
  };

  const renderConnectionRow = (conn: Connection) => (
    <div
      key={conn.id}
      className={tableStyles.tableRow}
      style={{ gridTemplateColumns: '1fr 2fr 2fr 2fr 1fr' }}
      role="row"
      tabIndex={0}
      aria-label={`Conexão ${conn.nome.split('_')[0]}`}
    >
      <div
        data-label="Status"
        onClick={() => handleStatusToggle(conn)}
        className={tableStyles.clickableStatus}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleStatusToggle(conn)}
        aria-pressed={conn.status}
      >
        <span className={`${tableStyles.statusChip} ${conn.status ? tableStyles.active : tableStyles.inactive}`}>
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

      <div className={tableStyles.actionCell}>
        <button className={tableStyles.actionButtonEdit} onClick={() => handleEdit(conn)} aria-label="Editar">
          <EditIcon />
        </button>
        <button className={tableStyles.actionButtonDelete} onClick={() => handleDelete(conn.id)} aria-label="Deletar">
          <DeleteIcon />
        </button>
      </div>
    </div>
  );

  return (
    <div className={PageStyles.container}>
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={PageStyles.containerHeader}>
        <div className={PageStyles.headerTitles}>
          <h2>Suas conexões do WhatsApp</h2>
          <h3>Verifique, adicione ou desative suas conexões do WhatsApp.</h3>
        </div>
        <Button label="Adicionar Conexão" onClick={() => openModal()} />
      </motion.header>

      <div className={PageStyles.containerContent}>
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

        <div className={PageStyles.containerBottom}>
          <button
            className={`${PageStyles.buttonBase} ${activeFilter === 'ativo' ? PageStyles.activeFilter : ''}`}
            onClick={() => setActiveFilter('ativo')}
          >
            <span>Ver conexões ativas</span>
          </button>
          <button
            className={`${PageStyles.buttonBase} ${activeFilter === 'inativo' ? PageStyles.activeFilter : ''}`}
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
        />
      </Modal>

    </div>
  );
}