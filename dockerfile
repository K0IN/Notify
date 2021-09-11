FROM node:16-alpine

WORKDIR /usr/src/app

COPY . .

WORKDIR /usr/src/app/src

RUN npm install

ENTRYPOINT [ "npm", "run", "run_docker" ]