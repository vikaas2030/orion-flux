# ── Stage 1: Build Frontend ────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# ── Stage 2: Production Server ─────────────────────
FROM node:20-alpine

WORKDIR /app

# Copy server
COPY server/package*.json ./server/
RUN cd server && npm ci --production

COPY server/ ./server/

# Copy built frontend
COPY --from=builder /app/client/dist ./client/dist

# Create database directory
RUN mkdir -p database

ENV PORT=5000
ENV NODE_ENV=production
EXPOSE 5000

WORKDIR /app/server
CMD ["node", "app.js"]
