# build our frontend (preact)
FROM node:alpine AS frontend_builder

WORKDIR /usr/src

COPY app/frontend app

WORKDIR /usr/src/app

RUN npm install

RUN npm run build


FROM denoland/deno:alpine
WORKDIR /app
EXPOSE 8787

COPY --from=frontend_builder /usr/src/app/build /app/static-site


COPY app/backend . 
# RUN deno cache main.ts

# healthchecks
RUN apk update && apk add --no-cache curl
HEALTHCHECK CMD curl --fail http://localhost:8787 || exit 1

ENTRYPOINT [ "deno", "run", "--allow-net", "--allow-read", "--allow-write", "--allow-env", "--allow-run", "main.ts" ] 
