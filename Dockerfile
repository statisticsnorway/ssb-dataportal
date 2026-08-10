# syntax=docker.io/docker/dockerfile:1

# Based on example from: https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM cgr.dev/chainguard/node:latest-dev AS base
USER root
RUN npm install -g pnpm@11.9.0
USER node

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY --chown=node:node pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
RUN pnpm i --prod --frozen-lockfile


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# Pre-create prerender cache dir so it can be COPY --chown'd into distroless
RUN mkdir -p .next/cache

# Production image, copy all the files and run next
FROM gcr.io/distroless/nodejs26-debian13:nonroot AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

USER nonroot:nonroot

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
