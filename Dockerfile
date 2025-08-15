# Fase 1: Build dell'applicazione
FROM node:20-slim as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Esegui lo script di build SSR che abbiamo definito in package.json
RUN npm run build:ssr

# Fase 2: Immagine di produzione
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
# Copia solo le dipendenze di produzione
COPY --from-builder /app/package*.json ./
RUN npm install --omit=dev

# Copia l'intera cartella di build
COPY --from-builder /app/dist/azzurra-makeup-deploy ./dist/azzurra-makeup-deploy

EXPOSE 8080

# Avvia il server usando il percorso corretto e universale
CMD [ "node", "dist/azzurra-makeup-deploy/server/it/main.js" ]