# Stage 1: Builder - Compilación y dependencias (Node >= 22.23.4 patched for CVE-2026-111497)
FROM node:22.23.4-alpine AS builder

WORKDIR /app

# Copia archivos necesarios para instalar dependencias
COPY package.json package-lock.json tsconfig.json ./

# Instala todas las dependencias (incluyendo devDependencies)
RUN npm ci

# Copia todo el código fuente
COPY src ./src

# Compila TypeScript a JavaScript
RUN npm run build

# Stage 2: Runtime - Solo producción (Node >= 22.23.4 patched for CVE-2026-111497)
FROM node:22.23.4-alpine

WORKDIR /app

# Copia archivos necesarios para producción
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/dist ./dist
COPY .env . 

# Instala solo dependencias de producción
RUN npm ci --only=production

# Expone el puerto
EXPOSE 3200

# Comando para producción
CMD ["npm", "start"]