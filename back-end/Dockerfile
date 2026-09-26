# Imagen base de Node.js
FROM node:22-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Habilitar pnpm mediante Corepack
RUN corepack enable

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar el código del proyecto
COPY . .

# Compilar NestJS
RUN pnpm build

# Puerto que utiliza NestJS
EXPOSE 4000

# Iniciar aplicación en producción
CMD ["pnpm", "start:prod"]