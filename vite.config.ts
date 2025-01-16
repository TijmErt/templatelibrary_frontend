import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(  {
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define:{
    'process.env': process.env,
    VITE_SQL_URL: process.env.VITE_SQL_URL,
    VITE_NOSQL_URL:process.env.VITE_NOSQL_URL,
    VITE_WEBSOCKET_URL: process.env.VITE_WEBSOCKET_URL,
  }
})
