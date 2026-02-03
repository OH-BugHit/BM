import React, { useEffect, useRef, useState, useCallback } from 'react';
import style from './style.module.css';
import { fetchImageUrls } from '../../services/ImageService';
import { Button } from '@genai-fi/base';
import { useTranslation } from 'react-i18next';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { useAtom } from 'jotai';
import { activeViewAtom, configAtom, labelsAtom, modelAtom } from '../../atoms/state';
import OpenedImage from '../../components/ImageView/OpenedImage';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { motion } from 'framer-motion';

/**
 * Component shows a gallery of images from a dataset
 * @returns
 */
function DatasetGallery({ mode }: { mode: 'student' | 'teacher' }) {
    const { t } = useTranslation();
    const [allImages, setAllImages] = useState<string[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [noMoreData, setNoMoreData] = useState(false);
    const [openImage, setOpenImage] = useState<string | null>(null);
    const limit = 10;
    const [config] = useAtom(configAtom);
    const [selected, setSelected] = useState('');
    const [, setActiveView] = useAtom(activeViewAtom);
    const [imagePaths, setImagePaths] = useState<Record<string, string[]>>({});
    const loaded = useRef(false);
    const [labels] = useAtom(labelsAtom);
    const [model] = useAtom(modelAtom);

    /**
     * Loads more images with offset.
     */
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
    const doClose = useCallback(() => setActiveView((old) => ({ ...old, overlay: 'none' })), [setActiveView]);

    useEffect(() => {
        if (loaded.current) return;
        if (config.modelData.name.length > 0) {
            fetchImageUrls({ dataset: config.modelData }).then((data) => {
                setImagePaths(data);
            });
        }
        loaded.current = true;
    }, [config.modelData]);

    useEffect(() => {
        setSelected('');
        setImages([]);
        loaded.current = false;
    }, [config.modelData.name]);

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
        <>
            <motion.div
                className={`${style.datasetGallery} ${mode === 'teacher' ? style.teacherGallery : ''}`}
                initial={{ opacity: 0, scale: mode === 'teacher' ? 1 : 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: mode === 'teacher' ? 1 : 0.7 }}
                transition={{ duration: 0.2 }}
            >
                <div className={`${style.titleRow} ${mode === 'teacher' ? style.teacherRow : ''}`}>
                    {mode === 'student' && (
                        <Button
                            onClick={doClose}
                            title={t('common.close')}
                            aria-label="Sulje"
                            style={{
                                position: 'absolute',
                                top: '0.1rem',
                                right: '0.1rem',
                                zIndex: 900,
                                border: 'none',
                                width: 32,
                                height: 32,
                                fontSize: 24,
                                cursor: 'pointer',
                            }}
                        >
                            <CloseSharpIcon />
                        </Button>
                    )}
                    <h1 style={{ color: 'black' }}>{t('common.dataset')}</h1>
                </div>
                <FormControl className={style.selector}>
                    <InputLabel id="term-label">{t('common.selectLabel')}</InputLabel>
                    <Select
                        labelId="term-label"
                        value={selected}
                        onChange={(e) => setSelected(e.target.value || '')}
                    >
                        {(model?.getLabels() ?? [])
                            .slice()
                            .sort((a, b) => {
                                // Järjestä käännösten mukaan
                                const va = labels?.labels?.get(a) ?? a;
                                const vb = labels?.labels?.get(b) ?? b;
                                return va.localeCompare(vb, 'fi', { sensitivity: 'base' });
                            })
                            .map((label) => (
                                <MenuItem
                                    key={label}
                                    value={label}
                                >
                                    {labels?.labels?.get(label) ?? label}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
                {images.length === 0 && !loading && selected.length !== 0 && (
                    <em className={style.noData}>{t('common.noTeachingData')}</em>
                )}
                <div className={style.gridContainer}>
                    <div
                        className={`${style.imageGrid} ${mode === 'teacher' ? style.teacherGrid : ''}`}
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
                </div>
            </motion.div>
            <OpenedImage
                setOpenImage={setOpenImage}
                openImage={openImage ? openImage.replace('_thumb', '') : null}
            />
        </>
    );
}

export default React.memo(DatasetGallery);
