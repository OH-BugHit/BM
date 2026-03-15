import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import React from 'react';

// Mockit TOP-level ennen muita importteja
vi.mock('../../components/Footer/Footer', () => ({
    default: () => <div data-testid="footer" />,
}));

vi.mock('react-i18next', () => {
    type TOptions = { returnObjects?: boolean };
    return {
        useTranslation: () => ({
            t: (key: string, options?: TOptions) => {
                if (options?.returnObjects) {
                    return ['Welcome to our Privacy Notice', 'Second paragraph'];
                }
                return key === 'about.title' ? 'Generation AI' : key;
            },
            i18n: {
                changeLanguage: () => Promise.resolve(),
            },
        }),
        Trans: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    };
});

import { screen } from '@testing-library/react';
import About from './About';
import { renderWithProviders } from '../../test-utils/render';

describe('About', () => {
    it('renders title', () => {
        renderWithProviders(<About />);
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Generation AI');
    });

    it('renders logo image', () => {
        renderWithProviders(<About />);
        const images = screen.getAllByAltText('logo');
        expect(images[0]).toHaveAttribute('src', '/logo192_bw.png');
    });

    it('renders privacy markdown content', () => {
        renderWithProviders(<About />);
        const markdownContent = screen.getByText(/Welcome to our Privacy Notice/);
        expect(markdownContent).toBeInTheDocument();
    });

    it('renders footer', () => {
        renderWithProviders(<About />);
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
});
