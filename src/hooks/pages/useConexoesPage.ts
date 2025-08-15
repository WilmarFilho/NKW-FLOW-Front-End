import { useState, useMemo, useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { addConnectionModalState, connectionsState } from '../../state/atom';
import { useConnections } from '../connections/useConnections';
import type { Connection } from '../../types/connection';
import { useAddConnection } from '../connections/useAddConnection';
import { validateConnectionForm } from '../utils/useValidator';

type Filter = 'todos' | 'ativo' | 'inativo';
type SortField = 'nome' | null;
type SortOrder = 'asc' | 'desc';

export function useConexoesPage() {

  const connections = useRecoilValue(connectionsState)

  const { handleStartSession, handleEditConnection, isLoading, step, qrCode  } = useAddConnection();

  const { removeConnection, updateConnectionStatus, fetchConnections } = useConnections();
  const [activeFilter, setActiveFilter] = useState<Filter>('todos');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [formData, setFormData] = useState<Partial<Connection> | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Connection, string>>>({});

  const [modalState, setModalState] = useRecoilState(addConnectionModalState);

  const handleDelete = useCallback(async (id: string | number) => {
    const confirm = window.confirm('Tem certeza que deseja excluir esta conexão?');
    if (!confirm) return;

    try {
      await removeConnection(id.toString());
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
      alert('Falha ao alterar o status.');
    }
  }, [updateConnectionStatus]);

  const openModal = useCallback((conn?: Connection) => {

    setErrors({});
    setShowErrors(false);

    if (conn) {
      setFormData(conn)
      setModalState({ isOpen: true, editMode: true });
    } else {
      setModalState({ isOpen: true, editMode: false });
    }
  }, [setModalState]);

  const handleEdit = useCallback((conn: Connection) => {
    openModal(conn);
  }, [openModal]);

  const closeModal = useCallback(() => {
    setModalState({ isOpen: false, editMode: false });
    setFormData(null);
  }, []);

  const handleModalSaveClick = useCallback(async () => {
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
  }, [
    formData,
    modalState.editMode,
    handleEditConnection,
    closeModal,
    fetchConnections,
    handleStartSession
  ]);

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

  return {
    connections: sortedConnections,
    closeModal,
    activeFilter,
    sortField,
    sortOrder,
    modalState,
    formData,
    errors,
    showErrors,
    setFormData,
    setModalState,
    setActiveFilter,
    setSortField,
    setSortOrder,
    handleDelete,
    handleStatusToggle,
    handleEdit,
    openModal,
    fetchConnections,
    setErrors,
    handleModalSaveClick,
    isLoading,
    setShowErrors,
    step,
    qrCode,
  };
}