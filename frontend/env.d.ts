/// <reference models="vite/client" />
declare global {
  namespace NodeJS {
    interface ImportMeta {
      env: any;
    }
  }
}
