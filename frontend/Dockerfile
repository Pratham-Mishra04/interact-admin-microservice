FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY .env /app/.env

COPY . .

RUN npm run build

FROM node:18

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 5000

CMD [ "npm", "run", "start" ]