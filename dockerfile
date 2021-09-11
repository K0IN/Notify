FROM node:16-alpine AS frontend_builder
WORKDIR /usr/src
COPY ./src/frontend .
RUN npm install
RUN npm run build

FROM node:16-alpine
WORKDIR /usr/src/app
COPY . .
WORKDIR /usr/src/app/src
RUN npm install
COPY --from=frontend_builder /usr/src/build /usr/src/app/src/frontend/build
ENTRYPOINT [ "npm", "run", "run_docker" ]