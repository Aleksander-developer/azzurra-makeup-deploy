# Fase 1: Build dell'applicazione
FROM node:20-slim as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Questo comando costruisce l'app per la produzione con SSR
RUN npm run build

# Fase 2: Creazione dell'immagine di produzione
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
# Copia la build e le dipendenze di produzione
COPY --from=builder /app/dist/ ./dist/
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

# Google Cloud Run fornisce la porta tramite la variabile d'ambiente PORT
# La esporremo sulla 8080, che è uno standard comune.
EXPOSE 8080

# Avvia il server Node.js
# Controlla la cartella 'dist' dopo il build per essere sicuro del percorso
CMD [ "node", "dist/azzurra-makeup-deploy/server/main.mjs" ]