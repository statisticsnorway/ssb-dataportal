# syntax=docker.io/docker/dockerfile:1

# Based on example from: https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node@sha256:7c70d1235c0b4c2bc9eeed5393d19f1bbdde6885ba0d58ba62bb385d7b0f3ff1 AS base

RUN npm install -g pnpm@11.9.0

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./

RUN pnpm i --prod --frozen-lockfile


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm run build;

# Production image, copy all the files and run next
FROM gcr.io/distroless/nodejs24-debian13@sha256:ef5f3caf80da1630edd1a4df7b307a8f7d4553f8eec1dd29852b76e793593903 AS runner
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
