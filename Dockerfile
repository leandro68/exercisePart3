FROM node:20-alpine3.20

WORKDIR /app

COPY package* ./

RUN npm install







