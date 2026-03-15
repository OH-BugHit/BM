import { createStore } from 'jotai';
import { activeViewAtom } from '../../atoms/state';
import { screen } from '@testing-library/react';
import { ModelOrigin } from '../../utils/types';
import { renderWithProviders } from '../../test-utils/render';
import { vi } from 'vitest';

// Mockataan lapset top-level, jotta hookit eivät aja importin yhteydessä
vi.mock('./DatasetGallery', () => ({
    default: () => <div data-testid="dataset-gallery" />,
}));

vi.mock('./DatasetGalleryRemote', () => ({
    default: () => <div data-testid="dataset-gallery-remote" />,
}));

import { TeacherDatasetWrapper } from './TeacherDatasetWrapper';

describe('TeacherDatasetWrapper', () => {
    it('renders DatasetGallery when origin is GenAI', () => {
        const store = createStore();

        store.set(activeViewAtom, {
            ...store.get(activeViewAtom),
            active: 'datasetGallery',
        });

        window.history.pushState({}, '', `?origin=${ModelOrigin.GenAI}`);

        renderWithProviders(<TeacherDatasetWrapper />, { store });

        expect(screen.getByTestId('dataset-gallery')).toBeInTheDocument();
    });

    it('renders DatasetGalleryRemote when origin is not GenAI', () => {
        const store = createStore();

        store.set(activeViewAtom, {
            ...store.get(activeViewAtom),
            active: 'datasetGallery',
        });

        window.history.pushState({}, '', '?origin=remote');

        renderWithProviders(<TeacherDatasetWrapper />, { store });

        expect(screen.getByTestId('dataset-gallery-remote')).toBeInTheDocument();
    });

    it('renders nothing when active view is not datasetGallery', () => {
        const store = createStore();

        store.set(activeViewAtom, {
            ...store.get(activeViewAtom),
            active: 'userGridSimple',
        });

        window.history.pushState({}, '', `?origin=${ModelOrigin.GenAI}`);

        renderWithProviders(<TeacherDatasetWrapper />, { store });

        expect(screen.queryByTestId('dataset-gallery')).not.toBeInTheDocument();
        expect(screen.queryByTestId('dataset-gallery-remote')).not.toBeInTheDocument();
    });
});
