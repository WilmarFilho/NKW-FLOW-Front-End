// Libbs
import { useSetRecoilState } from 'recoil';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
// Atom
import { addConnectionModalState } from '../../state/atom';
// Hooks
import { useConnections } from '../../hooks/connections/useConnections';
// Components
import Button from '../../components/Gerais/Buttons/Button';
import AddConnectionModal from '../../components/Conexoes/ConnectionForm';
import GenericTable from '../../components/Gerais/Tables/GenericTable';
// Types
import type { Connection } from '../../types/connection';
// Css
import PageStyles from '../PageStyles.module.css'
import tableStyles from '../../components/Gerais/Tables/TableStyles.module.css';
// Assets
import EditIcon from './assets/arrow-circle.svg';
import DeleteIcon from './assets/x-circle.svg';
import { useMemo, useState } from 'react';



export default function ConexoesPage() {

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta conexão?')) {
      await removeConnection(id).catch(err => alert('Falha ao excluir: ' + err));
    }
  };

  const { connections, removeConnection } = useConnections();

  const [activeFilter, setActiveFilter] = useState<'todos' | 'ativo' | 'inativo'>('todos');
  const [sortField, setSortField] = useState<keyof Connection | 'nome' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const setModalState = useSetRecoilState(addConnectionModalState);

  const handleOpenModal = () => {
    setModalState({
      isOpen: true,
      initialData: null,
      editMode: false,
    });
  };
  const handleEdit = (conn: Connection) => {
    setModalState({
      isOpen: true,
      initialData: {
        id: conn.id,
        nome: conn.nome,
        status: conn.status,
        agente_id: conn.agente_id,
      },
      editMode: true,
    });
  };

  const filteredConnections = useMemo(() => {
    if (activeFilter === 'todos') {
      return connections;
    }
    const isStatusActive = activeFilter === 'ativo';
    return connections.filter(connection => connection.status === isStatusActive);
  }, [connections, activeFilter]);

  const sortedConnections = useMemo(() => {
    const data = [...filteredConnections];
    if (!sortField) return data;

    return data.sort((a, b) => {
      const getFieldValue = (connection: Connection) => {
        switch (sortField) {
          case 'nome':
            return connection.nome.toLowerCase();
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
  }, [filteredConnections, sortField, sortOrder]);

  const renderConnectionRow = (conn: Connection) => (
    <div
      key={conn.id}
      className={tableStyles.tableRow}
      style={{ gridTemplateColumns: '2fr 2fr 2fr 1fr 1fr' }}
    >
      <div data-label="Nome">{conn.nome.split('_')[0]}</div>
      <div data-label="Número">{conn.numero || 'N/A'}</div>
      <div data-label="Agente">
        <NavLink to="/agentes">{conn.agente?.tipo_de_agente || 'Nenhum'}</NavLink>
      </div>
      <div data-label="Status">
        <span className={`${tableStyles.statusChip} ${conn.status ? tableStyles.active : tableStyles.inactive}`}>
          {conn.status ? 'Ativo' : 'Inativo'}
        </span>
      </div>
      <div className={tableStyles.actionCell}>
        <button className={tableStyles.actionButton} onClick={() => handleEdit(conn)} aria-label="Editar">
          <EditIcon />
        </button>
        <button className={tableStyles.actionButton} onClick={() => handleDelete(conn.id)} aria-label="Deletar">
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
          <h2>Suas conexões do WhatsApp</h2>
          <h3>Verifique, adicione ou desative suas conexões do WhatsApp.</h3>
        </div>
        <Button label="Adicionar Conexão" onClick={() => handleOpenModal()} />
      </motion.header>

      <div className={PageStyles.containerContent} >

        <GenericTable<Connection>
          columns={['Nome', 'Número', 'Agente', 'Status', '']}
          data={sortedConnections}
          renderRow={renderConnectionRow}
          gridTemplateColumns="2fr 2fr 2fr 1fr 1fr"
          onSortClick={(col) => {
            const fieldMap: Record<string, 'nome'> = {
              'Nome': 'nome'
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
            <span>Ver conexões ativas</span>
          </button>
          <button
            className={`${PageStyles.buttonBase} ${activeFilter === 'inativo' ? PageStyles.activeFilter : ''}`}
            onClick={() => setActiveFilter('inativo')}

          >
            <span>Ver conexões Inativas</span>
          </button>
        </div>

      </div>

      <AddConnectionModal />

    </div>
  );
}