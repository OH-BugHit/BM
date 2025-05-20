import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './i18n';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import { theme } from '@knicos/genai-base';

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>
);
