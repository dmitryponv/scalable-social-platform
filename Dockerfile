# Multi-stage build for optimized production image
FROM node:18 AS builder

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build client and server with production environment
ENV VITE_PRODUCTION=true
RUN pnpm run build:client && pnpm run build:server

# Production stage
FROM node:18-slim

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev deps needed by dist)
RUN pnpm install --frozen-lockfile

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY .env.example .env.example

# Expose ports
EXPOSE 5000
EXPOSE 5443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/ping', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application directly with node
CMD ["node", "dist/server/node-build.mjs"]
