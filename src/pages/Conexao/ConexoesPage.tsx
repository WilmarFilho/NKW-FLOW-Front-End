import { addConnectionModalState } from '../../state/atom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Button from '../../components/Gerais/Buttons/Button';
import ConnectionForm from '../../components/Conexoes/ConnectionForm';
import GenericTable from '../../components/Gerais/Tables/GenericTable';
import type { Connection } from '../../types/connection';
import './conexoes.css';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useConnections } from '../../hooks/useConnections';

export default function ConexoesPage() {

  const { connections, loading, error } = useConnections();
  
  const setModalState = useSetRecoilState(addConnectionModalState);
  const { isOpen } = useRecoilValue(addConnectionModalState);

  if (loading) {
    return '';
  }

  if (error) {
    return <div><h2>Erro ao carregar: {error}</h2></div>;
  }

  const handleOpenModal = (): void => {
    setModalState({ isOpen: true });
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
          <h2>Suas conexões</h2>
          <h3>Verifique as conexões atuais, adicione ou desative…</h3>
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
              <div>{conn.nome.split('_')[0]}</div>
              <div>{conn.numero}</div>
              <NavLink to="/agentes"><div className="agent-select">{conn.agente.tipo_de_agente}</div></NavLink>
              <div
                className={`status-chip ${conn.status ? 'active' : 'inactive'}`}
              >
                {conn.status ? 'Ativado' : 'Desativado'}
              </div>
            </div>
          )}
        />

      </motion.div>




      {isOpen && <ConnectionForm />}

    </div>
  );
}
