const isDevelopment = import.meta.env.DEV;

const nodeApiUrl = isDevelopment
  ? import.meta.env.VITE_API_NODE_URL // -> LOCAL
  : 'http://localhost:3000';                          // -> VERCEL

if (isDevelopment && !nodeApiUrl) {
  console.error(
    'A URL da API (VITE_API_NODE_URL) não foi definida no seu arquivo .env.'
  );
}

export const apiConfig = {
  node: nodeApiUrl,
};
