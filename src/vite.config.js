import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      // @anthropic-ai/sdk ลาก tools/agent-toolset (Node-only: node:crypto, node:fs,
      // node:child_process) ผ่าน dynamic import ใน worker environment ที่ฝั่ง browser
      // ไม่เคยเรียก — stub ทิ้งเพื่อให้ build ผ่าน
      {
        find: /^.*agent-toolset\/(node|skills|fs-util).*$/,
        replacement: fileURLToPath(new URL('./src/lib/empty-agent-toolset.js', import.meta.url)),
      },
    ],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
