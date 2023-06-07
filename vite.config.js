import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@Components': path.resolve(__dirname, './src/components'),
      '@Services': path.resolve(__dirname, './src/services'),
      '@Views': path.resolve(__dirname, './src/views'),
      '@Stores': path.resolve(__dirname, './src/store'),
      '@Assets': path.resolve(__dirname, './src/assets'),
      '@Composables': path.resolve(__dirname, './src/composables'),
    },
  }
})
