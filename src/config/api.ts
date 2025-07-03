const nodeApiUrl = import.meta.env.VITE_API_NODE_URL;
const n8nApiUrl = import.meta.env.VITE_API_N8N_URL;

// Verifica se as URLs essenciais foram definidas
if (!nodeApiUrl || !n8nApiUrl ) {
  console.error(
    "Uma ou mais URLs de API não foram definidas nas variáveis de ambiente (.env.local)."
  );
}

// Exporta um único objeto com todas as configurações de API
export const apiConfig = {
  node: nodeApiUrl,
  n8n: n8nApiUrl,
};