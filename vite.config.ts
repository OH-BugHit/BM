import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        'import.meta.env.VITE_API_BASE_URL': JSON.stringify(''),
    },
    server: {
        proxy: {
            '/spoof': 'http://localhost:3001',
            '/api': 'http://localhost:3001',
        },
    },
});
