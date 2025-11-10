# ==============
#  Builder Image
# ==============
FROM oven/bun:1 AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun build src/index.ts --target bun --outdir dist

# ==============
#  Final Image
# ==============
FROM oven/bun:1 AS production
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=3000

USER bun

EXPOSE 3000
CMD ["bun", "run", "dist/index.js"]