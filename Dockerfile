# Estágio 1: Builder - Onde a aplicação React é construída
FROM node:18-alpine AS builder

WORKDIR /app

# Copia os arquivos de definição de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Executa o build de produção. Isso cria a pasta /app/build
RUN npm run build

# ---

# Estágio 2: Production - O servidor Nginx que servirá os arquivos
# Note que estamos usando uma imagem oficial do Nginx, não do Node!
FROM nginx:stable-alpine

# Copia os arquivos estáticos gerados no estágio de build
# para a pasta padrão que o Nginx serve
COPY --from=builder /app/build /usr/share/nginx/html

# Precisamos de uma configuração customizada para o Nginx lidar com o React Router
# (Veja o Passo 2 abaixo)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80, que é a porta padrão do Nginx
EXPOSE 80

# Comando padrão para iniciar o Nginx no foreground
CMD ["nginx", "-g", "daemon off;"]