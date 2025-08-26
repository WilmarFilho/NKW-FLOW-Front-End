// Libs
import { motion } from 'framer-motion';
// Css
import GlobalStyles from '../global.module.css';
import TableStyles from '../components/Gerais/Tables/TableStyles.module.css';
// Components
import GenericEntityRow from '../components/Gerais/Tables/GenericEntityRow';
import GenericTable from '../components/Gerais/Tables/GenericTable';
import Modal from '../components/Gerais/Modal/Modal';
import AttendantForm from '../components/Atendentes/AttendantForm';
import Button from '../components/Gerais/Buttons/Button';
// Hooks
import { useAtendentesPage } from '../hooks/pages/useAttendantsPage';
// Type
import type { Attendant } from '../types/attendant';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button as ChakraButton,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';

export default function AtendentesPage() {
  const {
    attendants,
    isModalOpen,
    connections,
    editData,
    isSubmitting,
    showErrors,
    handleDelete,
    handleEdit,
    handleSave,
    handleStatusToggle,
    handleFormChange,
    openModal,
    closeModal,
    sortField,
    sortOrder,
    setSortField,
    setSortOrder,
    activeFilter,
    setActiveFilter,
  } = useAtendentesPage();

  // --- INÍCIO: estado para confirmação de exclusão via Chakra AlertDialog ---
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [attendantToDelete, setAttendantToDelete] = useState<Attendant | null>(null);
  const cancelDeleteRef = useRef<HTMLButtonElement>(null);

  const openDeleteDialog = (att: Attendant) => {
    setAttendantToDelete(att);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!attendantToDelete) return;
    try {
      await handleDelete(attendantToDelete.id);
    } finally {
      setIsDeleteDialogOpen(false);
      setAttendantToDelete(null);
    }
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setAttendantToDelete(null);
  };

  const columnTemplate = '1fr 2fr 2fr 2fr 1fr';

  const columns = [
    {
      key: 'user',
      label: 'Status',
      render: (item: Attendant) => (
        <span
          className={`${TableStyles.statusChip} ${item.user.status ? TableStyles.active : TableStyles.inactive}`}
          onClick={() => handleStatusToggle(item)}
        >
          {item.user.status ? 'Ativo' : 'Inativo'}
        </span>
      ),
    },
    { key: 'user', label: 'Nome', render: (item: Attendant) => item.user.nome, onClick: handleEdit },
    { key: 'user', label: 'Email', render: (item: Attendant) => item.user.email, onClick: handleEdit },
    { key: 'user', label: 'Conexão', render: (item: Attendant) => item.connection.nome, onClick: handleEdit },
  ];

  return (
    <div className={GlobalStyles.pageContainer}>
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={GlobalStyles.pageHeader}>
        <div className={GlobalStyles.pageHeaderTitles}>
          <h2>Seus atendentes humanos</h2>
          <h3>Cadastre e gerencie os atendentes que podem interagir com seus clientes.</h3>
        </div>
        <Button label="Adicionar Atendente" onClick={openModal} />
      </motion.header>

      <div className={GlobalStyles.pageContent}>
        <GenericTable
          columns={columns.map(c => c.label || '')}
          data={attendants}
          renderRow={(attendant) => (
            <GenericEntityRow
              key={attendant.id}
              item={attendant}
              columns={columns}
              columnTemplate={columnTemplate}
              onEdit={handleEdit}
              onDelete={() => openDeleteDialog(attendant)}
            />
          )}
          gridTemplateColumns={columnTemplate}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortClick={(col) => {
            const fieldMap: Record<string, 'nome' | 'email' | 'numero' | 'status'> = {
              Nome: 'nome',
              Email: 'email',
              Número: 'numero',
              Status: 'status',
            };
            const selectedField = fieldMap[col];
            if (!selectedField) return;
            if (selectedField === sortField) setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
            else { setSortField(selectedField); setSortOrder('asc'); }
          }}
        />

        <div className={GlobalStyles.filterControls}>
          <button
            className={`${GlobalStyles.button} ${activeFilter === 'ativo' ? GlobalStyles.buttonActive : ''}`}
            onClick={() => setActiveFilter(prev => prev === 'ativo' ? 'todos' : 'ativo')}
          >
            <span>Ver atendentes ativos</span>
          </button>

          <button
            className={`${GlobalStyles.button} ${activeFilter === 'inativo' ? GlobalStyles.buttonActive : ''}`}
            onClick={() => setActiveFilter(prev => prev === 'inativo' ? 'todos' : 'inativo')}
          >
            <span>Ver atendentes inativos</span>
          </button>
        </div>
      </div>

      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelDeleteRef}
        onClose={closeDeleteDialog}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Excluir Atendente
            </AlertDialogHeader>

            <AlertDialogBody>
              {attendantToDelete ? (
                <>
                  Tem certeza que deseja excluir <strong>{attendantToDelete.user.nome}</strong>? Esta ação não pode ser desfeita.
                </>
              ) : (
                'Tem certeza que deseja excluir este atendente?'
              )}
            </AlertDialogBody>

            <AlertDialogFooter>
              <ChakraButton ref={cancelDeleteRef} onClick={closeDeleteDialog}>
                Cancelar
              </ChakraButton>
              <ChakraButton colorScheme="red" onClick={confirmDelete} ml={3}>
                Excluir
              </ChakraButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editData ? 'Editar Atendente' : 'Cadastrar Novo Atendente'}
        labelSubmit={editData ? 'Editar Atendente' : 'Cadastrar Atendente'}
        isSubmitting={isSubmitting}
        onSave={handleSave}
      >
        <AttendantForm
          connections={connections}
          initialData={editData || undefined}
          editMode={!!editData}
          onChange={handleFormChange}
          isSubmitting={isSubmitting}
          triggerValidation={showErrors}
        />
      </Modal>
    </div>
  );
}


