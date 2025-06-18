import { useEffect, useRef, useState, useCallback } from 'react';
import style from './style.module.css';
import { fetchImages } from '../../services/ImageService';
import { SpoofConfig } from '../../utils/types';

/**
 * component shows classification results from atom. This component is in this point for testing only
 * @returns
 */
export function DatasetGallery({ config }: { config: SpoofConfig }) {
    const [allImages, setAllImages] = useState<string[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [noMoreData, setNoMoreData] = useState(false);
    const limit = 10;

    const loadMore = useCallback(() => {
        if (loading || noMoreData) return;

        const nextImages = allImages.slice(offset, offset + limit);
        if (nextImages.length === 0) {
            setNoMoreData(true);
            return;
        }

        setImages((prev) => [...prev, ...nextImages]);
        setOffset((prev) => prev + limit);
    }, [allImages, offset, loading, noMoreData]);

    useEffect(() => {
        if (!config.data) return;

        setLoading(true);
        setImages([]);
        setAllImages([]);
        setOffset(0);
        setNoMoreData(false);

        fetchImages({ dataset: 'model1', label: config.data }).then((data) => {
            setAllImages(data);
            setImages(data.slice(0, limit));
            setOffset(limit);
            setLoading(false);
        });
    }, [config]);

    //scroll event listener
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleScroll = () => {
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50 && !loading) {
                if (noMoreData) return;
                loadMore();
            }
        };

        el.addEventListener('scroll', handleScroll);
        return () => el.removeEventListener('scroll', handleScroll);
    }, [offset, loading, config.data, loadMore, noMoreData]);

    return (
        <div className={style.container}>
            <h3>{config.data}</h3>
            <div
                className={style.datasetContainer}
                ref={containerRef}
            >
                {images.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`Kuva ${index}`}
                        className={style.image}
                    />
                ))}
            </div>
        </div>
    );
}
