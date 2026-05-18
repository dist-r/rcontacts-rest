# ==============
#  Builder Image
# ==============
FROM node:18 AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# ==============
#  Final Image
# ==============
FROM node:18 AS production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=3000

USER node

EXPOSE 3000
CMD ["node", "dist/server.js"]