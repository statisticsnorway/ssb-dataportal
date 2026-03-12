# syntax=docker.io/docker/dockerfile:1

# Based on example from: https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:22 AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --prod --frozen-lockfile;


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable pnpm && pnpm run build;

# Production image, copy all the files and run next
FROM gcr.io/distroless/nodejs22-debian12 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
SHELL ["mkdir", "-p", ".next/cache"]
SHELL ["chown", "1069:1069", ".next"]
SHELL ["chown", "1069:1069", ".next/cache"]


# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=1069:1069 /app/.next/standalone ./
COPY --from=builder --chown=1069:1069 /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["server.js"]
