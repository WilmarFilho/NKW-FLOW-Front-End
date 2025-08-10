import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useRecoilState } from 'recoil';

// Hooks
import { useConnections } from '../../hooks/connections/useConnections';

// Components
import Button from '../../components/Gerais/Buttons/Button';
import AddConnectionModal from '../../components/Conexoes/ConnectionForm';
import GenericTable from '../../components/Gerais/Tables/GenericTable';

// Types
import { addConnectionModalState } from '../../state/atom';
import type { Connection } from '../../types/connection';

// Styles
import PageStyles from '../PageStyles.module.css';
import tableStyles from '../../components/Gerais/Tables/TableStyles.module.css';

// Assets
import EditIcon from './assets/arrow-circle.svg';
import DeleteIcon from './assets/x-circle.svg';

export default function ConexoesPage() {
  const { connections, removeConnection, updateConnectionStatus } = useConnections();

  const [activeFilter, setActiveFilter] = useState<'todos' | 'ativo' | 'inativo'>('todos');
  const [sortField, setSortField] = useState<'nome' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [modalState, setModalState] = useRecoilState(addConnectionModalState);

  const handleDelete = useCallback(async (id: string) => {
    const confirm = window.confirm('Tem certeza que deseja excluir esta conexão?');
    if (!confirm) return;

    try {
      await removeConnection(id);
    } catch (err) {
      alert('Falha ao excluir: ' + err);
    }
  }, [removeConnection]);

  const handleStatusToggle = useCallback(async (connection: Connection) => {
    const newStatus = connection.status ? 'Inativo' : 'Ativo';
    const confirm = window.confirm(`Deseja alterar o status da conexão "${connection.nome.split('_')[0]}" para "${newStatus}"?`);
    if (!confirm) return;

    try {
      await updateConnectionStatus(connection);
    } catch {
      alert('Falha ao alterar o status: ');
    }
  }, [updateConnectionStatus]);

  const openModal = (conn?: Connection) => {
    if (conn) {
      setModalState({ isOpen: true, initialData: conn, editMode: true });
    } else {
      setModalState({ isOpen: true, initialData: null, editMode: false });
    }
  };

  const handleEdit = (conn: Connection) => {
    openModal(conn);
  };

  const filteredConnections = useMemo(() => {
    if (activeFilter === 'todos') return connections;
    const isActive = activeFilter === 'ativo';
    return connections.filter(c => c.status === isActive);
  }, [connections, activeFilter]);

  const sortedConnections = useMemo(() => {
    if (!sortField) return filteredConnections;

    return [...filteredConnections].sort((a, b) => {
      const aValue = a[sortField]?.toString().toLowerCase() ?? '';
      const bValue = b[sortField]?.toString().toLowerCase() ?? '';

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredConnections, sortField, sortOrder]);

  const renderConnectionRow = useCallback((conn: Connection) => (
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
  ), [handleDelete, handleEdit, handleStatusToggle]);

  return (
    <div className={PageStyles.container}>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={PageStyles.containerHeader}
      >
        <div className={PageStyles.headerTitles}>
          <h2>Suas conexões do WhatsApp</h2>
          <h3>Verifique, adicione ou desative suas conexões do WhatsApp.</h3>
        </div>
        <Button label="Adicionar Conexão" onClick={() => openModal()} />
      </motion.header>

      <div className={PageStyles.containerContent}>
        <GenericTable<Connection>
          columns={['Status', 'Nome', 'Número', 'Agente', '']}
          data={sortedConnections}
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

      <AddConnectionModal />

    </div>
  );
}