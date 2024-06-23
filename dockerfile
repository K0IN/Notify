FROM node:alpine AS frontend_builder
WORKDIR /usr/src
COPY app/frontend /usr/src/app
WORKDIR /usr/src/app
RUN npm install
RUN npm run build

# main image
FROM denoland/deno:alpine

# healthchecks
RUN apk update && apk add --no-cache curl
HEALTHCHECK CMD curl --fail http://localhost:8787 || exit 1

WORKDIR /app
EXPOSE 8787
COPY --from=frontend_builder /usr/src/app/build /app/static-site
COPY app/backend/ /app/
RUN deno cache deploy.ts

ENV FRONTEND='static-site'
ENV PORT=8787

ENTRYPOINT [ "deno", "run", "--allow-net", "--allow-read", "--allow-write", "--allow-env", "--unstable", "deploy.ts" ]