FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY packages/ms-users/package*.json ./packages/ms-users/

RUN npm ci --workspace=ms-users

COPY packages/ms-users ./packages/ms-users
COPY tsconfig.json ./
COPY proto ./packages/proto

RUN npx prisma generate --schema=./packages/ms-users/prisma/schema.prisma
RUN npm run build --workspace=ms-users

FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY packages/ms-users/package*.json ./packages/ms-users/

RUN npm ci --workspace=ms-users --only=production

COPY --from=builder /app/packages/ms-users/dist ./packages/ms-users/dist
COPY packages/ms-users/prisma ./packages/ms-users/prisma
COPY proto ./packages/proto

RUN npx prisma generate --schema=./packages/ms-users/prisma/schema.prisma

EXPOSE 3002
EXPOSE 50051

CMD ["node", "packages/ms-users/dist/index.js"]
