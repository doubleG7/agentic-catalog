/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEV_API_URL: string
  readonly VITE_QA_API_URL: string
  readonly VITE_STAGING_API_URL: string
  readonly VITE_PROD_API_URL: string
  // Add more environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}