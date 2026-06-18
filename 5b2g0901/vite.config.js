import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Đổi đoạn này từ react-swc thành plugin-react

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/WordPulse-5b2g0901-1/", // Giữ nguyên base này để khớp với kho lưu trữ GitHub
})