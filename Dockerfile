# ---- Build Stage ----
FROM node:22-alpine AS builder

# Create app directory
WORKDIR /app

# Enable corepack for yarn
RUN corepack enable && corepack prepare yarn@4.9.2 --activate

COPY package.json yarn.lock .yarnrc.yml ./

# Install dependencies
RUN yarn install

# Copy full app
COPY . .

RUN yarn build

# ---- Runtime Stage ----
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
ENV PORT=3000
ENV NODE_OPTIONS="--max_old_space_size=4096"

CMD ["node", "server.js"]
