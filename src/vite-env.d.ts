/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OMDB_API_KEY?: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
