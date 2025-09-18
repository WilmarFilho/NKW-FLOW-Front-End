// Libs
import { useState, useMemo, useCallback } from 'react';
import { useRecoilState } from 'recoil';
// Atom
import { addConnectionModalState } from '../../state/atom';
// Hooks
import { validateConnectionForm } from '../utils/useValidator';
import { useConnectionsActions } from '../connections/useConnectionsActions';
// Types
import type { Connection } from '../../types/connection';
import type { FilterStatus, SortOrder, SortField } from '../../types/table';

export function useConexoesPage() {

  const { connections, removeConnection, updateConnectionStatus, handleStartSession, handleEditConnection, setConnections } = useConnectionsActions();

  // Controle de Filtro e Ordenação
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('todos');
  const [sortField, setSortField] = useState<SortField<Connection>>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Controle de Erros e Modal
  const [modalState, setModalState] = useRecoilState(addConnectionModalState);
  const [formData, setFormData] = useState<Partial<Connection> | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Connection, string>>>({});

  const handleDelete = useCallback(async (id: string | number) => {
    await removeConnection(id.toString());
  }, [removeConnection]);

  const handleStatusToggle = useCallback(async (connection: Connection) => {
    await updateConnectionStatus(connection);
  }, [updateConnectionStatus]);

  const openModal = useCallback((conn?: Connection) => {
    setErrors({});
    setShowErrors(false);

    if (conn) {
      setFormData(conn);
      setModalState((prev) => ({
        ...prev,
        isOpen: true,
        editMode: true,
        step: 1,
        qrCode: null,
        isLoading: false,
      }));
    } else {
      setFormData(null);
      setModalState((prev) => ({
        ...prev,
        isOpen: true,
        editMode: false,
        step: 1,
        qrCode: null,
        isLoading: false,
      }));
    }
  }, [setModalState]);

  const handleEdit = useCallback((conn: Connection) => {
    openModal(conn);
  }, [openModal]);

  const closeModal = useCallback(() => {
    try {
      if (modalState.step === 2 && formData) {
        setConnections((prev) => {
          const pending = prev.find(
            (c) =>
              c.status === null &&
              c.nome === formData.nome &&
              (formData.numero ? c.numero === formData.numero : true)
          );
          if (!pending) return prev;
          return prev.filter((c) => c.id !== pending.id);
        });
      }
    } catch (err) {
      console.error('Erro ao remover conexão pendente localmente', err);
    } finally {
      setModalState({
        isOpen: false,
        editMode: false,
        step: 1,
        qrCode: null,
        isLoading: false,
      });
      setFormData(null);
    }
  }, [modalState.step, formData, setConnections, setModalState]);

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
      } else {
        await handleStartSession(formData);
      }
    }
  }, [formData, modalState.editMode, handleEditConnection, closeModal, handleStartSession]);

  const filteredConnections = useMemo(() => {
    if (activeFilter === 'todos') return connections;
    const isActive = activeFilter === 'ativo';
    return connections.filter((c) => c.status === isActive);
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
    isLoading: modalState.isLoading,
    qrCode: modalState.qrCode,
    step: modalState.step,
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
    setErrors,
    handleModalSaveClick,
  };
}