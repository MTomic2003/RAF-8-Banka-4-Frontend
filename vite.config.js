import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const proxyOptions = (target) => ({
  target,
  changeOrigin: true,
  configure: (proxy) => {
    proxy.on('proxyReq', (proxyReq) => {
      proxyReq.removeHeader('cookie');
      proxyReq.removeHeader('origin');
      proxyReq.removeHeader('referer');
    });
  },
});

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/banking': {
        ...proxyOptions('http://localhost:8081'),
        rewrite: (path) => path.replace(/^\/api\/banking/, '/api'),
      },
      '/api': proxyOptions('http://localhost:8080'),
    },
  },
})
