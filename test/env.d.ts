interface ImportMetaEnv {
  readonly VITEST_POOL_ID: string
  readonly VITE_NODE_ENV?: string
  readonly VITE_HTTP_LOG?: string
  readonly VITE_RPC_CREDENTIALS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
