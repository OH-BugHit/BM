// src/components/ImageViewer.tsx
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { loadImage } from '../../services/loadImage';
import { imageCacheAtom, currentImageAtom } from '../../atoms/state';
import style from './style.module.css';

export default function ImageViewer() {
    const [cache, setCache] = useAtom(imageCacheAtom);
    const [currentImage] = useAtom(currentImageAtom);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const isCached = cache[currentImage];
        if (!isCached) {
            loadImage(currentImage)
                .then((url: string) => {
                    setCache((prev: Record<string, string>) => ({ ...prev, [currentImage]: url }));
                })
                .catch((err: Error) => {
                    setError(err.message);
                });
        }
    }, [currentImage, cache, setCache]);

    if (error) return <p>Virhe: {error}</p>;

    const src = cache[currentImage];

    return src ? (
        <img
            src={src}
            alt={currentImage}
            className={style.imageContainer}
        />
    ) : (
        <p>Ladataan kuvaa...</p>
    );
}
