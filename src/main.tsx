import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './i18n';
import { ThemeProvider } from '@mui/material';
import App from './App';
import { theme } from '@genai-fi/base';

console.log('THEME', theme);

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>
);
