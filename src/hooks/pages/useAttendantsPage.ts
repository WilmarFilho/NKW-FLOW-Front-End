import { useState, useMemo } from 'react';
import { useAttendantsActions } from '../attendants/useAttendantsActions';
import { validateAttendantForm } from '../utils/useValidator';
import type { Attendant, AttendantFormData } from '../../types/attendant';

export function useAtendentesPage() {
  const { attendants, addAttendant, removeAttendant, editAttendant, updateAttendantStatus } = useAttendantsActions();

  const [showErrors, setShowErrors] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'todos' | 'ativo' | 'inativo'>('todos');
  const [sortField, setSortField] = useState<keyof AttendantFormData | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [editData, setEditData] = useState<AttendantFormData | null>(null);
  const [editAttendantId, setEditAttendantId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AttendantFormData | null>(null);

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Tem certeza?')) return;
    await removeAttendant(id.toString());
  };

  const handleStatusToggle = async (attendant: Attendant) => {
    if (window.confirm('Deseja alterar o status do atendente?')) {
      await updateAttendantStatus(attendant);
    }
  };

  const handleEdit = (attendant: Attendant) => {
    if (!attendant.user) return;
    setEditAttendantId(attendant.id);
    setEditData({
      id: attendant.id,
      user_id: attendant.user_id,
      nome: attendant.user.nome,
      email: attendant.user.email,
      status: attendant.user.status,
      numero: attendant.user.numero,
    });
    setFormData({
      id: attendant.id,
      user_id: attendant.user_id,
      nome: attendant.user.nome,
      email: attendant.user.email,
      status: attendant.user.status,
      numero: attendant.user.numero,
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (data: AttendantFormData) => setFormData(data);

  const handleModalSaveClick = async () => {
    setShowErrors(true);
    if (!formData) return;
    const foundErrors = validateAttendantForm(formData, !!editData);
    if (Object.keys(foundErrors).length > 0) return;

    if (editAttendantId) {
      await editAttendant(editAttendantId, formData.user_id!, formData);
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