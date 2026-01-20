# LeadSwap MCP Server Dockerfile
# Multi-stage build for optimized production image

# ========================================
# Stage 1: Dependencies
# ========================================
FROM node:24-alpine AS deps

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --include=dev

# Generate Prisma client
RUN npx prisma generate

# ========================================
# Stage 2: Builder
# ========================================
FROM node:24-alpine AS builder

WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copy source
COPY . .

# Build the application
RUN npm run server:build
RUN npm run web:build

# ========================================
# Stage 3: Production
# ========================================
FROM node:24-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 leadswap

# Copy built assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./

# Create logs directory
RUN mkdir -p logs && chown -R leadswap:nodejs logs

# Switch to non-root user
USER leadswap

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the server
CMD ["node", "dist/index.js"]
