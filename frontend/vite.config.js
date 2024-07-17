import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://3000-idx-homefindr-1721045075219.cluster-bec2e4635ng44w7ed22sa22hes.cloudworkstations.dev",
        changeOrigin: true, // Add this line 
        secure: false, // You might not need this if your backend has a valid SSL certificate
      },
    },
  },
});
