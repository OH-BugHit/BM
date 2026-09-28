import { useCallback, useMemo, useRef, useState } from 'react';
import type { SetStateAction } from 'react';

export function useDatasetGallery<T>(
    initialSelected: string,
    itemsByLabel: Record<string, T[]> | null,
    resetDeps: unknown[] = [],
    limit = 10
) {
    const [galleryState, setGalleryState] = useState({
        initialSelected,
        resetDeps: [...resetDeps],
        selected: initialSelected,
        offset: limit,
    });
    const [openImage, setOpenImage] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const resetChanged =
        galleryState.initialSelected !== initialSelected ||
        galleryState.resetDeps.length !== resetDeps.length ||
        resetDeps.some((dependency, index) => !Object.is(dependency, galleryState.resetDeps[index]));

    if (resetChanged) {
        setGalleryState({
            initialSelected,
            resetDeps: [...resetDeps],
            selected: initialSelected,
            offset: limit,
        });
    }

    const selected = resetChanged ? initialSelected : galleryState.selected;
    const offset = resetChanged ? limit : galleryState.offset;
    const allItems = useMemo(() => (selected ? (itemsByLabel?.[selected] ?? []) : []), [selected, itemsByLabel]);
    const items = allItems.slice(0, offset);
    const loading = false;
    const noMoreData = offset >= allItems.length;

    const setSelected = useCallback(
        (next: SetStateAction<string>) => {
            setGalleryState((previous) => ({
                ...previous,
                selected: typeof next === 'function' ? next(previous.selected) : next,
                offset: limit,
            }));
        },
        [limit]
    );

    const loadMore = useCallback(() => {
        if (loading || noMoreData) return;

        setGalleryState((previous) => ({
            ...previous,
            offset: Math.min(previous.offset + limit, allItems.length),
        }));
    }, [allItems, loading, noMoreData, limit]);

    return {
        selected,
        setSelected,
        items,
        openImage,
        setOpenImage,
        containerRef,
        loading,
        noMoreData,
        loadMore,
    };
}
