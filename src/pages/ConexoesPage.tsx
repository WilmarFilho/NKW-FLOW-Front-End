// Libs
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
// Components
import Button from '../components/Gerais/Buttons/Button';
import ConnectionForm from '../components/Conexoes/ConnectionForm';
import GenericTable from '../components/Gerais/Tables/GenericTable';
import GenericEntityRow from '../components/Gerais/Tables/GenericEntityRow';
import Modal from '../components/Gerais/Modal/Modal';
// Hooks
import { useConnectionsPage } from '../hooks/connections/useConnectionsPage';
// Css
import GlobalStyles from '../global.module.css';
import TableStyles from '../components/Gerais/Tables/TableStyles.module.css';
// Type
import { Connection } from '../types/connection';

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
    setFormData,
    setActiveFilter,
    setSortField,
    setSortOrder,
    handleDelete,
    handleStatusToggle,
    handleEdit,
    openModal,
    closeModal,
    handleModalSaveClick,
    isLoading,
    step,
    qrCode,
  } = useConnectionsPage();

  const columnTemplate = '1fr 2fr 2fr 2fr 1fr';

  const columns = [
    {
      key: 'status',
      label: 'Status',
      render: (conn: Connection) => (
        <span
          className={`${TableStyles.statusChip} ${conn.status ? TableStyles.active : TableStyles.inactive}`}
        >
          {conn.status ? 'Ativo' : 'Inativo'}
        </span>
      ),
      onClick: handleStatusToggle, // só status
    },
    {
      key: 'nome',
      label: 'Nome',
      render: (conn: Connection) => conn.nome.split('_')[0],
      onClick: handleEdit, // qualquer clique na coluna chama edit
    },
    {
      key: 'numero',
      label: 'Número',
      render: (conn: Connection) => conn.numero || 'N/A',
      onClick: handleEdit,
    },
    {
      key: 'agente',
      label: 'Agente',
      render: (conn: Connection) => <NavLink to="/agentes">{conn.agente?.tipo_de_agente || 'Nenhum'}</NavLink>,
    },
  ];

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
          columns={columns.map(c => c.label || '')}
          data={connections}
          renderRow={(conn) => (
            <GenericEntityRow
              key={conn.id}
              item={conn}
              columns={columns}
              columnTemplate={columnTemplate}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          gridTemplateColumns={columnTemplate}
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