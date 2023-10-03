import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@Components': path.resolve(__dirname, './src/components'),
      '@Services': path.resolve(__dirname, './src/services'),
      '@Views': path.resolve(__dirname, './src/views'),
      '@Stores': path.resolve(__dirname, './src/stores'),
      '@Assets': path.resolve(__dirname, './src/assets'),
    }
  }
})
