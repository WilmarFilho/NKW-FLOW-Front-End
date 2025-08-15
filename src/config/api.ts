// 1. Detectar o ambiente (a mágica do Vite)
const isDevelopment = import.meta.env.DEV;

// 2. Definir a URL base dinamicamente
// Se for desenvolvimento, usa a URL do .env. Se for produção, usa o caminho relativo '/api'.
const nodeApiUrl = isDevelopment
  ? import.meta.env.VITE_API_NODE_URL // -> http://192.168.208.1:5679 (local)
  : '/api';                          // -> /api (em produção na Vercel)

// Verifica se a URL foi definida (apenas para o caso de desenvolvimento)
if (isDevelopment && !nodeApiUrl) {
  console.error(
    'A URL da API (VITE_API_NODE_URL) não foi definida no seu arquivo .env.'
  );
}

// 3. O resto do seu código não muda nada
// Exporta um único objeto com a URL base correta para o ambiente atual
export const apiConfig = {
  node: nodeApiUrl,
};