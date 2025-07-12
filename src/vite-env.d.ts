/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_REAL_API: string;
  readonly VITE_42_API_BASE_URL: string;
  readonly VITE_42_CLIENT_ID: string;
  readonly VITE_42_CLIENT_SECRET: string;
  readonly VITE_42_REDIRECT_URI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
