// Libbs
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
// Components
import GenericTable from '../../components/Gerais/Tables/GenericTable';
import Button from '../../components/Gerais/Buttons/Button';
import Modal from '../../components/Gerais/ModalForm/Modal';
import AttendantForm from '../../components/Atendentes/AttendantForm';
// Types
import type { Attendant, AttendantFormData } from '../../types/attendant';
// Hooks
import { useAttendants } from '../../hooks/attendants/useAttendants';
// Css
import PageStyles from '../PageStyles.module.css';
import tableStyles from '../../components/Gerais/Tables/TableStyles.module.css'
// Assets
import EditIcon from './assets/arrow-circle.svg';
import DeleteIcon from './assets/x-circle.svg';



export default function AtendentesPage() {

  const { attendants, addAttendant, removeAttendant, editAttendant, updateAttendantStatus } = useAttendants();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'todos' | 'ativo' | 'inativo'>('todos');

  const [sortField, setSortField] = useState<keyof AttendantFormData | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');


  const [editData, setEditData] = useState<AttendantFormData | null>(null);
  const [editAttendantId, setEditAttendantId] = useState<string | null>(null);
  const [editUserId, setEditUserId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza?')) {
      await removeAttendant(id).catch(err => alert('Falha ao excluir: ' + err));
    }
  };

  const handleStatusToggle = async (attendant: Attendant) => {
    // Adicione um confirm para segurança, se desejar
    if (window.confirm('Deseja alterar o status do atendente?')) {
      await updateAttendantStatus(attendant).catch(err => alert('Falha ao alterar o status: ' + err.message));
    }
  };

  const handleEdit = (attendant: Attendant) => {
    if (!attendant.user) return;

    setEditAttendantId(attendant.id);
    setEditUserId(attendant.user_id);
    
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
      // edição
      console.log(editAttendantId, data.user_id, data)
      await editAttendant(editAttendantId, data.user_id!, data);
    } else {
      // criação
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
    if (activeFilter === 'todos') {
      return attendants;
    }
    const isStatusActive = activeFilter === 'ativo';
    return attendants.filter(attendant => attendant.user.status === isStatusActive);
  }, [attendants, activeFilter]);

  const sortedAttendants = useMemo(() => {
    const data = [...filteredAttendants];
    if (!sortField) return data;

    return data.sort((a, b) => {
      const getFieldValue = (attendant: Attendant) => {
        switch (sortField) {
          case 'nome':
            return attendant.user.nome.toLowerCase();
          case 'email':
            return attendant.user.email.toLowerCase();
          case 'numero':
            return attendant.user.numero;
          case 'status':
            return attendant.user.status ? 1 : 0;
          default:
            return '';
        }
      };

      const aValue = getFieldValue(a);
      const bValue = getFieldValue(b);

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredAttendants, sortField, sortOrder]);




  const renderAttendantRow = (attendant: Attendant) => (
    <div
      key={attendant.id}
      className={tableStyles.tableRow}
      style={{ gridTemplateColumns: '1fr 2fr 2fr 2fr 1fr' }}
    >
      <div data-label="Status" onClick={() => handleStatusToggle(attendant)} className={tableStyles.clickableStatus}>

        {/* CORREÇÃO PRINCIPAL: Ler o status do objeto aninhado 'user' */}
        <span className={`${tableStyles.statusChip} ${attendant.user.status ? tableStyles.active : tableStyles.inactive}`}>
          {attendant.user.status ? 'Ativo' : 'Inativo'}
        </span>

      </div>
      <div data-label="Nome" className={tableStyles.cellName}>
        <span>{attendant.user.nome}</span>
      </div>
      <div data-label="Email">{attendant.user.email}</div>
      <div data-label="Número">{attendant.user.numero}</div>

      <div className={tableStyles.actionCell}>
        <button className={tableStyles.actionButtonEdit} onClick={() => handleEdit(attendant)} aria-label="Editar">
          <EditIcon />
        </button>
        <button className={tableStyles.actionButtonDelete} onClick={() => handleDelete(attendant.id)} aria-label="Deletar">
          <DeleteIcon />
        </button>
      </div>
    </div>
  );

  return (
    <div className={PageStyles.container}>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={PageStyles.containerHeader}
      >
        <div className={PageStyles.headerTitles}>
          <h2>Seus atendentes humanos</h2>
          <h3>Cadastre e gerencie os atendentes que podem interagir com seus clientes.</h3>
        </div>
        <Button label="Adicionar Atendente" onClick={() => openModal()} />
      </motion.header>

      <div className={PageStyles.containerContent} >
        <GenericTable<Attendant>
          columns={['Status', 'Nome', 'Email', 'Número', '']}
          data={sortedAttendants}
          renderRow={renderAttendantRow}
          gridTemplateColumns="1fr 2fr 2fr 2fr 1fr"
          onSortClick={(col) => {
            const fieldMap: Record<string, 'nome' | 'email' | 'numero' | 'status'> = {
              'Nome': 'nome',
              'Email': 'email',
              'Número': 'numero',
              'Status': 'status',
            };

            const selectedField = fieldMap[col];

            if (selectedField === sortField) {
              setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
            } else {
              setSortField(selectedField); // Agora o tipo é válido
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
            <span>Ver atendentes ativos</span>
          </button>
          <button
            className={`${PageStyles.buttonBase} ${activeFilter === 'inativo' ? PageStyles.activeFilter : ''}`}
            onClick={() => setActiveFilter('inativo')}
          >
            <span>Ver Atendentes Inativos</span>
          </button>
        </div>

      </div>



      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editAttendantId ? 'Editar Atendente' : 'Cadastrar Novo Atendente'}
      >
        <AttendantForm
          onSave={handleSave}
          onClose={closeModal}
          initialData={editData ? {
            nome: editData.nome,
            email: editData.email,
            status: editData.status,
            numero: editData.numero, 
            user_id: editData.user_id
          } : undefined}
          editMode={!!editData}
        />
      </Modal>
    </div >
  );
}




