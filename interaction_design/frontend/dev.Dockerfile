FROM node:16-alpine AS frontend

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

CMD npm run dev
