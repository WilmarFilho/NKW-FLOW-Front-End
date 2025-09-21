# Estágio 1: Build da Aplicação (usando uma imagem Node)
FROM node:18-alpine as builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e o package-lock.json (ESSA LINHA MUDOU)
COPY package.json package-lock.json ./

# Instala as dependências do projeto com NPM (ESSA LINHA MUDOU)
# Usamos 'npm ci' que é mais rápido e seguro para builds automatizados
RUN npm ci

# Copia o restante dos arquivos da aplicação
COPY . .

# Executa o comando de build para gerar os arquivos estáticos (ESSA LINHA MUDOU)
RUN npm run build

# Estágio 2: Servidor de Produção (usando uma imagem Nginx)
FROM nginx:stable-alpine

# Copia o arquivo de configuração personalizado do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove a página de boas-vindas padrão do Nginx
RUN rm /usr/share/nginx/html/index.html

# Copia os arquivos estáticos gerados no estágio de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]