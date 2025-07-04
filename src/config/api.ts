const nodeApiUrl = import.meta.env.VITE_API_NODE_URL;

// Verifica se as URLs essenciais foram definidas
if (!nodeApiUrl ) {
  console.error(
    "Uma ou mais URLs de API não foram definidas nas variáveis de ambiente (.env.local)."
  );
}

// Exporta um único objeto com todas as configurações de API
export const apiConfig = {
  node: nodeApiUrl,
};