FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/ms-wallet/package*.json ./packages/ms-wallet/

RUN npm ci --workspace=ms-wallet

COPY packages/ms-wallet ./packages/ms-wallet
COPY tsconfig.json ./

RUN npm run build --workspace=ms-wallet

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY packages/ms-wallet/package*.json ./packages/ms-wallet/

RUN npm ci --workspace=ms-wallet --only=production

COPY --from=builder /app/packages/ms-wallet/dist ./packages/ms-wallet/dist
COPY packages/ms-wallet/prisma ./packages/ms-wallet/prisma

RUN npx prisma generate --schema=./packages/ms-wallet/prisma/schema.prisma

EXPOSE 3001

CMD ["node", "packages/ms-wallet/dist/index.js"]
