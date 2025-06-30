import { CSSProperties } from 'react';

export const close: CSSProperties = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    zIndex: 1100,
    background: '#ffffff99',
    border: 'none',
    width: 32,
    height: 32,
    fontSize: 24,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
};

export const closeGallery: CSSProperties = {
    position: 'absolute',
    top: '0.1rem',
    right: '0.1rem',
    zIndex: 1100,
    border: 'none',
    width: 32,
    height: 32,
    fontSize: 24,
    cursor: 'pointer',
};
