import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock must be at top level before other imports
vi.mock('../../components/Footer/Footer', () => ({
    default: () => <div data-testid="footer" />,
}));

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

        // Privacy array from translation.json is rendered as markdown
        const markdownContent = screen.getByText(/Welcome to our Privacy Notice/);
        expect(markdownContent).toBeInTheDocument();
    });

    it('renders footer', () => {
        renderWithProviders(<About />);

        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
});
