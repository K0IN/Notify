// todo make this ajustable by the user
export const isDebug = true;
export const dbName = 'notify-db';
export const dbVersion = 1;
export const apiBase = isDebug ? "http://localhost:8787/api" : "/api" // if you host this somewhere use full url example: "http://localhost:8787/api"