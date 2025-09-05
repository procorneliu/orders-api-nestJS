FROM node:24 AS base

FROM base AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./

RUN npm install
RUN npx prisma generate --schema=./schema.prisma

COPY . .

RUN npm run build

FROM base AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src

CMD [ "npm", "run", "start:migrate:prod" ]