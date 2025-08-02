// Libbs
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
// Atom
import { addConnectionModalState } from '../../state/atom';
// Hooks
import { useConnections } from '../../hooks/connections/useConnections';
// Components
import Button from '../../components/Gerais/Buttons/Button';
import ConnectionForm from '../../components/Conexoes/ConnectionForm';
import GenericTable from '../../components/Gerais/Tables/GenericTable';
// Types
import type { Connection } from '../../types/connection';
// Css
import './conexoes.css';
// Assets
import XCheck from './assets/x-circle.svg';
import ArrowUp from './assets/arrow-circle.svg';

export default function ConexoesPage() {

  const { connections, removeConnection } = useConnections();

  const setModalState = useSetRecoilState(addConnectionModalState);
  const { isOpen } = useRecoilValue(addConnectionModalState);

  const handleOpenModal = () => {
    setModalState({ isOpen: true, initialData: null, editMode: false });
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


  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta conexão?')) {
      try {
        await removeConnection(id);
      } catch (error) {
        alert('Não foi possível excluir a connection.' + error);
      }
    }
  };

  return (
    <div className="connections-container">


      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className="connections-header"
      >

        <div>
          <h2>Suas conexões do WhatsApp</h2>
          <h3>Verifique suas conexões do WhatsApp aqui, você também pode adicionar ou desativar.</h3>
        </div>

        <Button label="Adicionar Conexão" onClick={handleOpenModal} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className="generic-table"
      >

        <GenericTable<Connection>
          columns={['Nome', 'Número', 'Agente', 'Status']}
          data={connections}
          renderRow={(conn, i) => (
            <div className="connection-row" key={i}>
              <div className='box-table-nome'>
                {conn.nome.split('_')[0]}
                <button className="edit-button" onClick={() => handleEdit(conn)} ><ArrowUp /></button>
                <button className="delete-button" onClick={() => handleDelete(conn.id)}><XCheck /></button>
              </div>
              <div>{conn.numero}</div>
              <NavLink to="/agentes"><div className="agent-select">{conn.agente.tipo_de_agente}</div></NavLink>
              <div className='column-action-conex'>
                <div
                  className={`status-chip ${conn.status ? 'active' : 'inactive'}`}
                >
                  {conn.status ? 'Ativado' : 'Desativado'}

                </div>

              </div>
            </div>
          )}
        />

      </motion.div>

      {isOpen && <ConnectionForm />}

    </div>
  );
}
