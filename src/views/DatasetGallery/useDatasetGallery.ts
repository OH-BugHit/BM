import { useCallback, useEffect, useRef, useState } from 'react';

export function useDatasetGallery<T>(
    initialSelected: string,
    itemsByLabel: Record<string, T[]> | null,
    resetDeps: unknown[] = [],
    limit = 10
) {
    const [selected, setSelected] = useState(initialSelected);
    const [allItems, setAllItems] = useState<T[]>([]);
    const [items, setItems] = useState<T[]>([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [noMoreData, setNoMoreData] = useState(false);
    const [openImage, setOpenImage] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setSelected(initialSelected);
    }, [initialSelected]);

    useEffect(() => {
        setSelected(initialSelected);
        setItems([]);
        setAllItems([]);
        setOffset(0);
        setLoading(false);
        setNoMoreData(false);
    }, resetDeps);

    useEffect(() => {
        if (!selected) return;

        const selectedItems = itemsByLabel?.[selected];
        if (selectedItems === undefined) return;

        setLoading(true);
        const data = selectedItems;
        setAllItems(data);
        setItems(data.slice(0, limit));
        setOffset(data.length > limit ? limit : data.length);
        setNoMoreData(data.length <= limit);
        setLoading(false);
    }, [selected, itemsByLabel, limit]);

    const loadMore = useCallback(() => {
        if (loading || noMoreData) return;

        if (offset >= allItems.length) {
            setNoMoreData(true);
            return;
        }

        const nextItems = allItems.slice(offset, offset + limit);
        setItems((prev) => [...prev, ...nextItems]);
        setOffset((prev) => prev + nextItems.length);

        if (offset + limit >= allItems.length) {
            setNoMoreData(true);
        }
    }, [allItems, offset, loading, noMoreData, limit]);

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
