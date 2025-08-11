// hooks/useAttendantsPage.ts
import { useState, useMemo } from 'react';
import { useAttendants } from './/useAttendants';
import type { Attendant, AttendantFormData } from '../../types/attendant';

export function useAttendantsPage() {
  const { attendants, addAttendant, removeAttendant, editAttendant, updateAttendantStatus } = useAttendants();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'todos' | 'ativo' | 'inativo'>('todos');
  const [sortField, setSortField] = useState<keyof AttendantFormData | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [editData, setEditData] = useState<AttendantFormData | null>(null);
  const [editAttendantId, setEditAttendantId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza?')) {
      await removeAttendant(id).catch(err => alert('Falha ao excluir: ' + err));
    }
  };

  const handleStatusToggle = async (attendant: Attendant) => {
    if (window.confirm('Deseja alterar o status do atendente?')) {
      await updateAttendantStatus(attendant).catch(err => alert('Falha ao alterar o status: ' + err.message));
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
    handleDelete,
    handleEdit,
    handleSave,
    handleStatusToggle,
    setActiveFilter,
    setSortField,
    setSortOrder,
    openModal,
    closeModal,
  };
}