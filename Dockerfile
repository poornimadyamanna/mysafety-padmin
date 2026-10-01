# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app

# Copy only package files first (better caching)
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app


# Copy only what is needed to run
COPY --from=builder /app/package.json ./package.json
COPY next.config.* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start"]