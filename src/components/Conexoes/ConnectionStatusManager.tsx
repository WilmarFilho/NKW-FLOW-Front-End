import { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { connectionsState } from '../../state/atom';

export default function ConnectionStatusManager() {
  const [connections, setConnections] = useRecoilState(connectionsState);
  const activeListeners = useRef<Map<string, EventSource>>(new Map());

  useEffect(() => {
    const currentInstanceNames = new Set(connections.map(c => c.instanceName));

    // --- Iniciar novos listeners ---
    connections.forEach(conn => {
      if (!activeListeners.current.has(conn.instanceName)) {
        console.log(`[Manager] Iniciando listener para ${conn.instanceName}`);
        const eventSource = new EventSource(
          `http://192.168.208.1:5679/webhook/events/${conn.instanceName}`
        );

        eventSource.onmessage = (event) => {
          const eventData = JSON.parse(event.data);
          console.log(`[Manager] Evento recebido para ${conn.instanceName}:`, eventData);

          // LÓGICA ALTERADA AQUI
          if (eventData.event === 'connection.update') {
            const isConnected = eventData.state === 'open';

            // Se a conexão não estiver mais 'open' (desconectada)...
            if (!isConnected) {
              console.log(`[Manager] Conexão ${conn.instanceName} desconectada. Removendo da lista.`);
              // ...filtramos a lista, removendo a conexão com este instanceName.
              setConnections(prevConns => 
                prevConns.filter(c => c.instanceName !== conn.instanceName)
              );
              // Como a conexão foi removida, o próprio listener será fechado na próxima etapa do useEffect
            }
          }
        };

        eventSource.onerror = () => {
          console.error(`[Manager] Erro no SSE para ${conn.instanceName}. Removendo.`);
          // Em caso de erro, também removemos a conexão da lista
          setConnections(prevConns => 
            prevConns.filter(c => c.instanceName !== conn.instanceName)
          );
          eventSource.close(); // Fechamos explicitamente aqui
          activeListeners.current.delete(conn.instanceName);
        };

        activeListeners.current.set(conn.instanceName, eventSource);
      }
    });

    // --- Encerrar listeners antigos ---
    // Esta parte agora é ainda mais importante, pois é ela que efetivamente fecha o SSE
    // depois que a conexão é removida do estado do Recoil.
    activeListeners.current.forEach((eventSource, instanceName) => {
      if (!currentInstanceNames.has(instanceName)) {
        console.log(`[Manager] Encerrando listener para instância removida: ${instanceName}`);
        eventSource.close();
        activeListeners.current.delete(instanceName);
      }
    });

    return () => {
      console.log("[Manager] Desmontando. Encerrando todos os listeners.");
      activeListeners.current.forEach(eventSource => eventSource.close());
    };

  }, [connections, setConnections]);

  return null;
}