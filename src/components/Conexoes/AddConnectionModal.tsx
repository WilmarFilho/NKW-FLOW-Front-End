import { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent, JSX } from "react";
import { useRecoilState, useSetRecoilState } from 'recoil';
import { connectionsState, addConnectionModalState } from '../../state/atom';
import type { Connection } from "../../types/connection";
import Modal from "../Gerais/Modal/Modal";

export default function AddConnectionModal(): JSX.Element | null {
  const [modalState, setModalState] = useRecoilState(addConnectionModalState);
  const setConnections = useSetRecoilState(connectionsState);

  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({ name: "", agent: "Recepcionista" });
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [instanceName, setInstanceName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleClose = () => {
    setModalState({ isOpen: false });
    setStep(1);
    setQrCode(null);
    setError('');
  };

  if (!modalState.isOpen) {
    return null;
  }
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  }

  const handleStartSession = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const sessionName = `${formData.name.toLowerCase().replace(/\s/g, '_')}_${Date.now()}`;
    setInstanceName(sessionName);
    try {
      const res = await fetch('http://localhost:5678/webhook/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: sessionName })
      });
      if (!res.ok) throw new Error("Falha ao criar a sessão no backend.");
      const data = await res.json();
      setQrCode(data.qr_code);
      setStep(2);
    } catch (err) {
      setError("Não foi possível iniciar a conexão. Verifique o backend.");
    }
  };

  useEffect(() => {
    if (!modalState.isOpen || step !== 2 || !instanceName) return;
    const eventSource = new EventSource(`http://192.168.208.1:5679/webhook/events/${instanceName}`);
    eventSource.onmessage = (event) => {
      const eventData: any = JSON.parse(event.data);
      if (eventData.event === 'connection.update' && eventData.state === 'open') {
        const newConnection: Connection = {
          name: formData.name,
          agent: formData.agent,
          number: eventData.wuid.split('@')[0],
          status: true,
          instanceName: instanceName,
        };
        setConnections((current) => [...current, newConnection]);
        handleClose();
        eventSource.close();
      }
    };
    eventSource.onerror = () => {
      setError("Erro de comunicação com o servidor de eventos.");
      eventSource.close();
    };
    return () => eventSource.close();
  }, [step, instanceName, formData, setConnections, modalState.isOpen]);

  return (
    <Modal 
      isOpen={modalState.isOpen} 
      onClose={handleClose}
      title={step === 1 ? "Adicionar Nova Conexão" : "Conecte seu WhatsApp"}
    >
      {step === 1 && (
        <form onSubmit={handleStartSession} className="connection-form">
          <p>Preencha os dados para gerar o QR Code.</p>
          <div className="form-group">
            <label htmlFor="name">Nome da Conexão</label>
            <input id="name" type="text" value={formData.name} onChange={handleInputChange} placeholder="Ex: WhatsApp da Loja" required/>
          </div>
          <div className="form-group">
            <label htmlFor="agent">Agente IA</label>
            <select id="agent" value={formData.agent} onChange={handleInputChange}>
              <option>Recepcionista</option>
              <option>Vendedor</option>
              <option>Suporte</option>
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