import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://ec2-3-236-168-225.compute-1.amazonaws.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Agregar headers necesarios
            proxyReq.setHeader('Origin', 'http://ec2-3-236-168-225.compute-1.amazonaws.com');
            proxyReq.setHeader('Referer', 'http://ec2-3-236-168-225.compute-1.amazonaws.com');
          });
        }
      }
    }
  }
})
 