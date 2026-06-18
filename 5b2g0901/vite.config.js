import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/WordPulse-5b2g0901-1/", // Hoặc tên kho lưu trữ WordPulse chính xác của bạn trên GitHub
})