# Estágio 1: Build da Aplicação (usando uma imagem Node)
# Aqui usamos uma versão específica do Node.js. É bom alinhar com a versão que você usa em desenvolvimento.
FROM node:18-alpine as builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e o package-lock.json (ou yarn.lock)
# para aproveitar o cache de dependências do Docker
COPY package.json yarn.lock ./

# Instala as dependências do projeto
RUN yarn install --frozen-lockfile

# Copia o restante dos arquivos da aplicação
COPY . .

# Executa o comando de build para gerar os arquivos estáticos
RUN yarn build

# Estágio 2: Servidor de Produção (usando uma imagem Nginx)
# Esta imagem é muito menor que a imagem do Node, ideal para produção.
FROM nginx:stable-alpine

# Copia o arquivo de configuração personalizado do Nginx que criaremos
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove a página de boas-vindas padrão do Nginx
RUN rm /usr/share/nginx/html/index.html

# Copia os arquivos estáticos gerados no estágio de build
# A pasta de build do Vite é a 'dist'
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe a porta 80, que é a porta padrão do Nginx
EXPOSE 80

# Comando para iniciar o Nginx quando o container for executado
CMD ["nginx", "-g", "daemon off;"]