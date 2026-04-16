import React, { useEffect, useState, useCallback, useRef } from 'react';
import style from './style.module.css';
import { fetchImageUrls } from '../../services/ImageService';
import { Button } from '@genai-fi/base';
import { useTranslation } from 'react-i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import { activeViewAtom, configAtom, isOutOfFocusAtom, modelAtom, termTransferAtom } from '../../atoms/state';
import { useLocation } from 'react-router';
import Tip from '../../components/Tips/Tip';
import DatasetGalleryBase from './DatasetGalleryBase';
import { useDatasetGallery } from './useDatasetGallery';

/**
 * Component shows a gallery of images from a dataset. Only active class is shown
 * @returns
 */
function DatasetGalleryStudentStripped() {
    const { t } = useTranslation();
    const config = useAtomValue(configAtom);
    const currentTerm = useAtomValue(termTransferAtom);
    const setActiveView = useSetAtom(activeViewAtom);
    const setIsOutOfFocus = useSetAtom(isOutOfFocusAtom);
    const [imagePaths, setImagePaths] = useState<Record<string, string[]>>({});
    const loaded = useRef(false);
    const model = useAtomValue(modelAtom);
    const location = useLocation();
    const [available, setAvailable] = useState(false);

    const {
        selected,
        items: images,
        openImage,
        setOpenImage,
        containerRef,
        loading,
        noMoreData,
        loadMore,
    } = useDatasetGallery<string>(currentTerm.term, imagePaths, [config.modelData.name, currentTerm.term], 10);

    const doClose = useCallback(() => setActiveView((old) => ({ ...old, overlay: 'none' })), [setActiveView]);

    useEffect(() => {
        if (loaded.current) return;
        if (config.modelData.name.length > 0) {
            const modelName = model?.model?.getMetadata()?.modelName ?? 'unknown';
            if (modelName === 'jobs' || modelName === 'animals') {
                setAvailable(true);
                fetchImageUrls({ dataset: config.modelData }).then((data) => {
                    setImagePaths(data);
                });
            } else {
                setAvailable(false);
            }
        }
        loaded.current = true;
    }, [config.modelData, location.search, model]);

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

    if (!available) {
        return (
            <div className={style.tipContainer}>
                <Tip
                    user="student"
                    step="noTrainingData"
                />
            </div>
        );
    }

    return (
        <DatasetGalleryBase
            mode="student"
            showCloseButton
            onClose={() => {
                setIsOutOfFocus(undefined);
                doClose();
            }}
            images={images}
            renderItem={(src, index) => (
                <Button
                    key={index}
                    onClick={() => {
                        setIsOutOfFocus(true);
                        setOpenImage(src);
                    }}
                    className={style.thumbnailButton}
                >
                    <img
                        src={src}
                        alt={`Picture ${index} of dataset`}
                        className={style.image}
                    />
                </Button>
            )}
            openImage={openImage}
            setOpenImage={setOpenImage}
            containerRef={containerRef}
            loading={loading}
            showEmptyState={selected.length !== 0}
            emptyState={<em className={style.noData}>{t('common.noTeachingData')}</em>}
            available={available}
            availableFallback={
                <div className={style.tipContainer}>
                    <Tip
                        user="student"
                        step="noTrainingData"
                    />
                </div>
            }
            extraGridClass={style.teacherGrid}
        />
    );
}

export default React.memo(DatasetGalleryStudentStripped);
