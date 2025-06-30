import { useEffect, useRef, useState, useCallback } from 'react';
import style from './style.module.css';
import { fetchImageUrls, fetchModelNames } from '../../services/ImageService';
import { Button } from '@knicos/genai-base';
import { useTranslation } from 'react-i18next';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { close, closeGallery } from '../../components/Buttons/buttonStyles';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useAtom } from 'jotai';
import { menuShowTrainingDataAtom } from '../../atoms/state';

interface DatasetGalleryProps {
    allLabels: string[] | undefined;
}

/**
 * Component shows a gallery of images from a dataset
 * @returns
 */
export function DatasetGallery({ allLabels }: DatasetGalleryProps) {
    const { t } = useTranslation();
    const [allImages, setAllImages] = useState<string[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [noMoreData, setNoMoreData] = useState(false);
    const [openImage, setOpenImage] = useState<string | null>(null);
    const limit = 10;
    const [selected, setSelected] = useState('');
    const [open, setOpen] = useAtom(menuShowTrainingDataAtom);
    const [imagePaths, setImagePaths] = useState<Record<string, string[]>>({});
    const loaded = useRef(false);

    const loadMore = useCallback(() => {
        if (loading || noMoreData) return;

        if (offset >= allImages.length) {
            setNoMoreData(true);
            return;
        }

        const nextImages = allImages.slice(offset, offset + limit);
        setImages((prev) => [...prev, ...nextImages]);
        setOffset((prev) => prev + nextImages.length);

        if (offset + limit >= allImages.length) {
            setNoMoreData(true);
        }
    }, [allImages, offset, loading, noMoreData]);

    // Fetches all paths for labelimages
    useEffect(() => {
        if (!loaded.current)
            fetchModelNames().then((data) => {
                if (data.length !== 0)
                    fetchImageUrls({ dataset: data[0] }).then((data) => {
                        setImagePaths(data);
                    });
            });
        loaded.current = true;
    }, []);

    useEffect(() => {
        if (!selected || !imagePaths[selected]) return;
        setLoading(true);
        setImages([]);
        setAllImages([]);
        setOffset(0);
        setNoMoreData(false);

        const data = imagePaths[selected] as string[];
        setAllImages(data);
        setImages(data.slice(0, limit));
        setOffset(data.length > limit ? limit : data.length);
        setNoMoreData(data.length <= limit);
        setLoading(false);
    }, [selected, imagePaths]);

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
    }, [offset, loading, selected, loadMore, noMoreData]);

    return (
        <div>
            {open && (
                <div className={style.container}>
                    <div className={style.headerToggle}>
                        <Button
                            onClick={() => setOpen(false)}
                            title={t('common.close')}
                            aria-label="Sulje"
                            style={closeGallery}
                        >
                            <CloseSharpIcon />
                        </Button>
                        <h1>{t('common.dataset')}</h1>
                    </div>
                    <Autocomplete
                        options={allLabels || []}
                        value={selected}
                        style={{ padding: '4px', margin: '1rem', maxWidth: '600px', width: '100%' }}
                        onChange={(_, newValue) => setSelected(newValue || '')}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t('common.selectLabel')}
                            />
                        )}
                    />
                    {images.length === 0 && !loading && selected.length !== 0 && (
                        <em className={style.noData}>{t('common.noTeachingData')}</em>
                    )}
                    {images.length !== 0 && (
                        <>
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
                                        onClick={() => setOpenImage(src)}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {openImage && (
                        <div
                            className={style.openImageOverlay}
                            onClick={() => setOpenImage(null)}
                        >
                            <div className={style.imageWrapper}>
                                <Button
                                    onClick={() => setOpenImage(null)}
                                    style={close}
                                    title={t('common.close')}
                                    aria-label="Sulje"
                                >
                                    <CloseSharpIcon />
                                </Button>
                                <img
                                    src={openImage}
                                    alt="isompi kuva"
                                    style={{ maxWidth: '90vw', maxHeight: '90vh', boxShadow: '0 0 24px #000' }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
