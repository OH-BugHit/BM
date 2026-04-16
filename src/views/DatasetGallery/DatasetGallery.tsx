import React, { useEffect, useState, useCallback, useRef } from 'react';
import style from './style.module.css';
import { fetchImageUrls } from '../../services/ImageService';
import { useTranslation } from 'react-i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import { activeViewAtom, configAtom, isOutOfFocusAtom, labelsAtom, modelAtom } from '../../atoms/state';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useLocation } from 'react-router';
import DatasetGalleryBase from './DatasetGalleryBase';
import { useDatasetGallery } from './useDatasetGallery';
import { formatLabel, formatTrashLabel, isTrashClass, sortLabels } from './galleryUtils';

function DatasetGallery({ mode }: { mode: 'student' | 'teacher' }) {
    const { t } = useTranslation();
    const config = useAtomValue(configAtom);
    const labels = useAtomValue(labelsAtom);
    const model = useAtomValue(modelAtom);
    const setActiveView = useSetAtom(activeViewAtom);
    const setIsOutOfFocus = useSetAtom(isOutOfFocusAtom);
    const [imagePaths, setImagePaths] = useState<Record<string, string[]>>({});
    const loaded = useRef(false);
    const location = useLocation();

    const {
        selected,
        setSelected,
        items: images,
        openImage,
        setOpenImage,
        containerRef,
        loading,
        noMoreData,
        loadMore,
    } = useDatasetGallery<string>('', imagePaths, [config.modelData.name], 10);

    const doClose = useCallback(() => setActiveView((old) => ({ ...old, overlay: 'none' })), [setActiveView]);

    useEffect(() => {
        if (loaded.current) return;
        if (config.modelData.name.length > 0) {
            if (mode === 'student') {
                const modelName = model?.model?.getMetadata()?.modelName ?? 'unknown';
                if (modelName === 'jobs' || modelName === 'animals') {
                    fetchImageUrls({ dataset: config.modelData }).then((data) => {
                        setImagePaths(data);
                    });
                }
            } else {
                fetchImageUrls({ dataset: config.modelData }).then((data) => {
                    setImagePaths(data);
                });
            }
        }
        loaded.current = true;
    }, [config.modelData, location.search, model, mode]);

    useEffect(() => {
        if (openImage) {
            setIsOutOfFocus(true);
        } else {
            setIsOutOfFocus(undefined);
        }
    }, [openImage, setIsOutOfFocus]);

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
    }, [containerRef, loading, loadMore, noMoreData]);

    const allLabels = model?.getLabels() ?? [];
    const labelOptions = allLabels.filter((word) => !isTrashClass(word));
    const trashClasses = allLabels.filter(isTrashClass);

    const selector = (
        <FormControl className={style.selector}>
            <InputLabel id="term-label">{t('common.selectLabel')}</InputLabel>
            <Select
                labelId="term-label"
                value={selected}
                onChange={(e) => setSelected(e.target.value || '')}
            >
                {sortLabels(labelOptions, labels).map((label) => (
                    <MenuItem
                        key={label}
                        value={label}
                    >
                        {formatLabel(label, labels)}
                    </MenuItem>
                ))}
                {trashClasses[0] && (
                    <MenuItem
                        disabled
                        sx={{ fontWeight: 600 }}
                    >
                        {t('common.trashClasses')}
                    </MenuItem>
                )}
                {sortLabels(trashClasses, labels).map((label) => (
                    <MenuItem
                        key={label}
                        value={label}
                        sx={{ color: 'gray', fontStyle: 'italic' }}
                    >
                        {formatTrashLabel(label, labels)}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );

    return (
        <DatasetGalleryBase
            mode={mode}
            showCloseButton={mode === 'student'}
            onClose={
                mode === 'student'
                    ? () => {
                          setIsOutOfFocus(undefined);
                          doClose();
                      }
                    : undefined
            }
            selector={selector}
            images={images}
            renderItem={(src, index) => (
                <button
                    key={index}
                    onClick={() => setOpenImage(src)}
                    aria-label={t('common.aria.openImage')}
                    className={style.thumbnailButton}
                >
                    <img
                        src={src}
                        alt={`Kuva ${index}`}
                    />
                </button>
            )}
            openImage={openImage}
            setOpenImage={setOpenImage}
            containerRef={containerRef}
            loading={loading}
            showEmptyState={selected.length !== 0}
            emptyState={<em className={style.noData}>{t('common.noTeachingData')}</em>}
            extraGridClass={mode === 'teacher' ? style.teacherGrid : style.teacherGrid}
        />
    );
}

export default React.memo(DatasetGallery);
