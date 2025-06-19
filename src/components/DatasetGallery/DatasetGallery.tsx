import { useEffect, useRef, useState, useCallback } from 'react';
import style from './style.module.css';
import { fetchImages } from '../../services/ImageService';
import { SpoofConfig } from '../../utils/types';
import { Button } from '@knicos/genai-base';
import { useTranslation } from 'react-i18next';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { close } from '../Buttons/buttonStyles';

interface DatasetGalleryProps {
    config: SpoofConfig;
}

/**
 * Component shows a gallery of images from a dataset
 * @returns
 */
export function DatasetGallery({ config }: DatasetGalleryProps) {
    const { t } = useTranslation();
    const [allImages, setAllImages] = useState<string[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [noMoreData, setNoMoreData] = useState(false);
    const [closed, setClosed] = useState(true);
    const [openImage, setOpenImage] = useState<string | null>(null);
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
            {images.length === 0 && !loading && <em className={style.noData}>{t('common.noTeachingData')}</em>}
            {images.length !== 0 && (
                <>
                    <div className={style.headerToggle}>
                        <h3>
                            {config.data} - {t('common.dataset')}
                        </h3>
                        <Button
                            onClick={() => setClosed((prev) => !prev)}
                            variant="outlined"
                        >
                            {' '}
                            {closed ? <p>{t('common.show')}</p> : <p>{t('common.hide')}</p>}
                        </Button>
                    </div>

                    <div
                        className={closed ? style.hidden : style.datasetContainer}
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
    );
}
