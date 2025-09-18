// Libs
import { useState, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
// Hooks
import { validateAttendantForm } from '../utils/useValidator';
import { useAttendantsActions } from '../attendants/useAttendantsActions';
// Types
import type { Attendant, AttendantFormData } from '../../types/attendant';
import type { FilterStatus, SortOrder, SortField } from '../../types/table';
// Atom
import { attendantsState, connectionsState } from '../../state/atom';

export function useAtendentesPage() {
  const attendants = useRecoilValue(attendantsState);
  const connections = useRecoilValue(connectionsState);
  const { addAttendant, removeAttendant, editAttendant, updateAttendantStatus } = useAttendantsActions();

  const [activeFilter, setActiveFilter] = useState<FilterStatus>('todos');
  const [sortField, setSortField] = useState<SortField<AttendantFormData>>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showErrors, setShowErrors] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<AttendantFormData | null>(null);
  const [editAttendantId, setEditAttendantId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AttendantFormData | null>(null);

  const handleDelete = async (id: string | number) => {
    await removeAttendant(id.toString()); 
  };

  const handleStatusToggle = async (attendant: Attendant) => {
    await updateAttendantStatus(attendant); 
  };

  const handleEdit = (attendant: Attendant) => {
    setEditAttendantId(attendant.id);

    const data: AttendantFormData = {
      id: attendant.id,
      user_id: attendant.user_id,
      nome: attendant.user.nome,
      email: attendant.user.email,
      status: attendant.user.status,
      numero: attendant.user.numero,
      connection_id: attendant.connection_id || '', 
    };

    setEditData(data);
    setFormData(data);
    setIsModalOpen(true);
  };

  const handleFormChange = (data: AttendantFormData) => setFormData(data);

  const handleModalSaveClick = async () => {
    setShowErrors(true);
    if (!formData) return;

    const foundErrors = validateAttendantForm(formData, !!editData);
    if (Object.keys(foundErrors).length > 0) return;

    if (editAttendantId) {
      console.log(formData)
      await editAttendant(editAttendantId, formData); 
    } else {
      await addAttendant(formData); 
    }

    closeModal();
  };

  const openModal = () => {
    setShowErrors(false);
    setEditAttendantId(null);
    setEditData(null);
    setFormData(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditAttendantId(null);
    setIsModalOpen(false);
  };

  const filteredAttendants = useMemo(() => {
    if (activeFilter === 'todos') return attendants;
    const isActive = activeFilter === 'ativo';
    return attendants.filter(a => a.user.status === isActive);
  }, [attendants, activeFilter]);

  const sortedAttendants = useMemo(() => {
    const data = [...filteredAttendants];
    if (!sortField) return data;
    return data.sort((a, b) => {
      const valA = getValue(a);
      const valB = getValue(b);
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredAttendants, sortField, sortOrder]);

  function getValue(attendant: Attendant) {
    switch (sortField) {
      case 'nome': return attendant.user.nome.toLowerCase();
      case 'email': return attendant.user.email.toLowerCase();
      case 'numero': return attendant.user.numero;
      case 'status': return attendant.user.status ? 1 : 0;
      default: return '';
    }
  }

  return {
    attendants: sortedAttendants,
    connections, 
    sortField,
    sortOrder,
    activeFilter,
    editData,
    isModalOpen,
    isSubmitting,
    formData,
    showErrors,
    handleDelete,
    handleEdit,
    handleSave: handleModalSaveClick,
    handleStatusToggle,
    handleFormChange,
    setActiveFilter,
    setSortField,
    setSortOrder,
    openModal,
    closeModal,
  };
}