import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 部署子路径时通过 BASE_URL 注入（GitHub Actions 中设置），默认根路径
export default defineConfig({
  base: process.env.BASE_URL || '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
