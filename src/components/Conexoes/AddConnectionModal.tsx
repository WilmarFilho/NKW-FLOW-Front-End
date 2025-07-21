// src/components/Modais/AddConnectionModal.tsx
import type { JSX } from 'react';
import { useRecoilState } from 'recoil';
import { addConnectionModalState } from '../../state/atom';
import Modal from '../Gerais/Modal/Modal';
import { useAddConnection } from '../../hooks/useAddConnection';
import { useAgents } from '../../hooks/useAgents';

export default function AddConnectionModal(): JSX.Element | null {
  const [modalState, setModalState] = useRecoilState(addConnectionModalState);
  const { agents, loading: isLoadingAgents, error: agentsError } = useAgents();

  const handleClose = () => {
    setModalState({ isOpen: false });
  };

  const {
    step,
    qrCode,
    formData,
    error,
    handleInputChange,
    handleStartSession
  } = useAddConnection(handleClose);

  if (!modalState.isOpen) return null;

  return (
    <Modal
      isOpen={modalState.isOpen}
      onClose={handleClose}
      title={step === 1 ? 'Adicionar Nova Conexão' : 'Conecte seu WhatsApp'}
    >
      {step === 1 && (
        <form onSubmit={handleStartSession} className="connection-form">
          <p>Preencha os dados para gerar o QR Code.</p>
          <div className="form-group">
            <label htmlFor="name">Nome da Conexão</label>
            <input id="nome" type="text" value={formData.nome} onChange={handleInputChange} placeholder="Ex: WhatsApp da Loja" required />
          </div>
          <div className="form-group">
            <label htmlFor="agent">Agente IA</label>
            {/* 3. ATUALIZE O SELECT PARA SER DINÂMICO */}
            <select id='agent' value={formData.agent} onChange={handleInputChange} disabled={isLoadingAgents}>
              {isLoadingAgents && <option>Carregando agentes...</option>}
              {agentsError && <option>Erro ao carregar agentes</option>}
              {!isLoadingAgents && !agentsError && (
                <>
                  {/* É uma boa prática ter uma opção default */}
                  <option value="" >Selecione um agente</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.tipo_de_agente}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
          <button type="submit" className="submit-button">Gerar QR Code</button>
        </form>
      )}

      {step === 2 && (
        <div className="qr-code-step">
          <p>Abra o WhatsApp em seu celular, vá em Aparelhos Conectados e escaneie o código abaixo.</p>
          {qrCode && <img src={qrCode} alt="QR Code para conectar no WhatsApp" />}
          {error && <p className="error-text">{error}</p>}
        </div>
      )}
    </Modal>
  );
}
