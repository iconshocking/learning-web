import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Define custom chunks to be code-split from the bundle for better caching/loading
          bootstrap: ["./src/assets/styles/bootstrap.min.css", "./src/assets/js/bootstrap.bundle.min.js"],
        },
      },
    },
  },
});
