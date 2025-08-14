import { useState, useMemo } from 'react';
import { useAttendants } from './/useAttendants';
import type { Attendant, AttendantFormData } from '../../types/attendant';

export function useAttendantsPage() {
  const { attendants, addAttendant, removeAttendant, editAttendant, updateAttendantStatus } = useAttendants();
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
    setIsModalOpen(true);
  };

  const handleSave = async (data: AttendantFormData) => {

    if (editAttendantId) {
      await editAttendant(editAttendantId, data.user_id!, data);
    } else {
      await addAttendant(data);
    }
    closeModal();
  };

  const openModal = () => {
    setShowErrors(false)
    setEditAttendantId(null);
    setEditData(null);
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
    handleSave,
    handleStatusToggle,
    setActiveFilter,
    setSortField,
    setSortOrder,
    openModal,
    closeModal,
    setFormData,
    setIsSubmitting,
    setShowErrors,
  };
}