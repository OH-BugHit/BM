import React, { useEffect, useRef } from 'react';
import style from './style.module.css';
import { useTranslation } from 'react-i18next';
import { useAtom, useSetAtom } from 'jotai';
import { configAtom, isOutOfFocusAtom, labelsAtom, modelAtom } from '../../atoms/state';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useLocation } from 'react-router';
import { ISample } from '@genai-fi/classifier/main/ClassifierApp';
import { CanvasCopy } from '../../components/CanvasCopy/CanvasCopy';
import DatasetGalleryBase from './DatasetGalleryBase';
import { useDatasetGallery } from './useDatasetGallery';
import { formatLabel, formatTrashLabel, isTrashClass, sortLabels } from './galleryUtils';

/**
 * Component shows a gallery of images from a dataset
 * @returns
 */
function DatasetGalleryRemote() {
    const { t } = useTranslation();
    const [config] = useAtom(configAtom);
    const [labels] = useAtom(labelsAtom);
    const [model] = useAtom(modelAtom);
    const setIsOutOfFocus = useSetAtom(isOutOfFocusAtom);
    const location = useLocation();
    const [imagePaths, setImagePaths] = React.useState<Record<string, ISample[] | null>>({});
    const loaded = useRef(false);
    const mode = 'teacher';

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
    } = useDatasetGallery<ISample>('', imagePaths as Record<string, ISample[]>, [config.modelData.name], 10);

    useEffect(() => {
        if (loaded.current) return;
        if (config.modelData.name.length > 0) {
            setImagePaths(() => {
                const result: Record<string, ISample[]> = {};
                const samples: ISample[][] = model?.samples ?? [];
                const labelsList: string[] = (typeof model?.getLabels === 'function' ? model.getLabels() : []) || [];

                labelsList.forEach((label, inx) => {
                    result[label] = samples[inx] ?? [];
                });

                return result;
            });
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
        setSelected('');
        loaded.current = false;
    }, [config.modelData.name, setSelected]);

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
            selector={selector}
            images={images}
            renderItem={(src, index) => (
                <button
                    key={index}
                    className={style.thumbnailButton}
                    onClick={() => setOpenImage(src.data.toDataURL())}
                    aria-label={t('common.aria.openImage')}
                >
                    <CanvasCopy sourceCanvas={src.data} />
                </button>
            )}
            openImage={openImage}
            setOpenImage={setOpenImage}
            containerRef={containerRef}
            loading={loading}
            showEmptyState={selected.length !== 0}
            emptyState={<em className={style.noData}>{t('common.noTeachingData')}</em>}
            extraGridClass={style.teacherGrid}
            containerTabIndex={0}
        />
    );
}

export default React.memo(DatasetGalleryRemote);
