import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://humble-spork-r4gr4vvpvr6vhq9w-3000.app.github.dev",
        changeOrigin: true,
        secure: true, // Use true if your backend has a valid SSL certificate
      },
    },
  },
});
