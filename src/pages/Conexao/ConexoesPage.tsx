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



export default function ConexoesPage() {

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta conexão?')) {
      await removeConnection(id).catch(err => alert('Falha ao excluir: ' + err));
    }
  };

  const { connections, removeConnection } = useConnections();

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
          data={connections}
          renderRow={renderConnectionRow}
          gridTemplateColumns="2fr 2fr 2fr 1fr 1fr"
        />

      </div>

      <AddConnectionModal />

    </div>
  );
}