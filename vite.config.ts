import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@containers': path.resolve(__dirname, 'src/containers'),
      '@helpers': path.resolve(__dirname, 'src/helpers'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@theme': path.resolve(__dirname, 'src/theme'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  assetsInclude: ['**/*.ttf', '**/*.woff', '**/*.woff2'],
});
