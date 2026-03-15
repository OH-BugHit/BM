import { it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { createStore } from 'jotai';

import { StudentDatasetWrapper } from './StudentDatasetWrapper';
import { activeViewAtom, configAtom } from '../../atoms/state';
import { renderWithProviders } from '../../test-utils/render';

vi.mock('./GalleryStudentStripped', () => ({
    default: () => <div data-testid="stripped-gallery" />,
}));

vi.mock('./DatasetGallery', () => ({
    default: () => <div data-testid="dataset-gallery" />,
}));

it('renders DatasetGallery when allowAllLabels and force are true', () => {
    const store = createStore();

    const config = store.get(configAtom);

    store.set(configAtom, {
        ...config,
        settings: {
            ...config.settings,
            allowAllLabels: true,
        },
        gallery: {
            ...config.gallery,
            force: true,
        },
    });

    renderWithProviders(<StudentDatasetWrapper />, { store });

    expect(screen.getByTestId('dataset-gallery')).toBeInTheDocument();
});

it('renders DatasetGallery when overlay is datasetGallery and gallery is on', () => {
    const store = createStore();

    const config = store.get(configAtom);

    store.set(configAtom, {
        ...config,
        settings: {
            ...config.settings,
            allowAllLabels: true,
        },
        gallery: {
            ...config.gallery,
            on: true,
        },
    });

    const activeView = store.get(activeViewAtom);

    store.set(activeViewAtom, {
        ...activeView,
        overlay: 'datasetGallery',
    });

    renderWithProviders(<StudentDatasetWrapper />, { store });

    expect(screen.getByTestId('dataset-gallery')).toBeInTheDocument();
});

it('renders stripped gallery when allowAllLabels is false', () => {
    const store = createStore();

    const config = store.get(configAtom);

    store.set(configAtom, {
        ...config,
        settings: {
            ...config.settings,
            allowAllLabels: false,
        },
        gallery: {
            ...config.gallery,
            force: true,
        },
    });

    renderWithProviders(<StudentDatasetWrapper />, { store });

    expect(screen.getByTestId('stripped-gallery')).toBeInTheDocument();
});

it('renders nothing when overlay is not datasetGallery', () => {
    const store = createStore();

    const activeView = store.get(activeViewAtom);

    store.set(activeViewAtom, {
        ...activeView,
        overlay: 'share',
    });

    const config = store.get(configAtom);

    store.set(configAtom, {
        ...config,
        gallery: {
            ...config.gallery,
            on: true,
            force: false,
        },
    });

    renderWithProviders(<StudentDatasetWrapper />, { store });

    expect(screen.queryByTestId('dataset-gallery')).not.toBeInTheDocument();

    expect(screen.queryByTestId('stripped-gallery')).not.toBeInTheDocument();
});
