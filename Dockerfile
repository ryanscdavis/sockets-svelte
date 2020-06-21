FROM node:13

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY ./public ./public
COPY ./server ./server

ENTRYPOINT [ "node", "./server/server.js" ]