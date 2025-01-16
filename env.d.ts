/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SQL_URL: string;
  readonly VITE_NOSQL_URL: string;
  readonly VITE_WEBSOCKET_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
