import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Frontpage from './Frontpage';
import { MemoryRouter } from 'react-router-dom';
// Mockit
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));
vi.mock('../../hooks/useModelLoader', () => ({
    useModelLoader: () => {},
}));
vi.mock('../../components/LangSelect/LangSelect', () => ({
    default: () => <div data-testid="lang-select" />,
}));
vi.mock('../../components/Footer/Footer', () => ({
    default: () => <div data-testid="footer" />,
}));
vi.mock('@knicos/genai-base', () => ({
    Button: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{props.children}</button>,
}));
vi.mock('@mui/material', () => ({
    TextField: (props: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; value?: string }) => (
        <input
            data-testid="textfield"
            value={props.value}
            onChange={props.onChange}
            onClick={props.onClick}
            aria-label={props.label}
        />
    ),
}));

describe('Frontpage', () => {
    it('renders the title', () => {
        render(
            <MemoryRouter>
                <Frontpage />
            </MemoryRouter>
        );
        expect(screen.getByText('common.title')).toBeDefined();
    });
});
