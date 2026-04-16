import React from 'react';
import style from './style.module.css';
import { Button } from '@genai-fi/base';
import { useTranslation } from 'react-i18next';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import OpenedImage from '../../components/ImageView/OpenedImage';
import { motion } from 'framer-motion';

export type DatasetGalleryBaseProps<T> = {
    mode: 'student' | 'teacher';
    title?: string;
    showCloseButton?: boolean;
    onClose?: () => void;
    selector?: React.ReactNode;
    images: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    openImage: string | null;
    setOpenImage: React.Dispatch<React.SetStateAction<string | null>>;
    containerRef: React.RefObject<HTMLDivElement> | React.RefObject<HTMLDivElement | null>;
    loading: boolean;
    showEmptyState: boolean;
    emptyState: React.ReactNode;
    available?: boolean;
    availableFallback?: React.ReactNode;
    extraGridClass?: string;
    containerTabIndex?: number;
};

function DatasetGalleryBase<T>(props: DatasetGalleryBaseProps<T>) {
    const {
        mode,
        title = 'dataset',
        showCloseButton,
        onClose,
        selector,
        images,
        renderItem,
        openImage,
        setOpenImage,
        containerRef,
        loading,
        showEmptyState,
        emptyState,
        available,
        availableFallback,
        extraGridClass,
        containerTabIndex,
    } = props;
    const { t } = useTranslation();

    if (available === false) {
        return <>{availableFallback ?? null}</>;
    }

    return (
        <>
            <motion.div
                className={`${style.datasetGallery} ${mode === 'teacher' ? style.teacherGallery : ''}`}
                initial={{ opacity: 0, scale: mode === 'teacher' ? 1 : 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: mode === 'teacher' ? 1 : 0.7 }}
                transition={{ duration: 0.2 }}
                inert={openImage ? true : undefined}
            >
                <div className={`${style.titleRow} ${mode === 'teacher' ? style.teacherRow : ''}`}>
                    {showCloseButton && onClose && (
                        <Button
                            onClick={onClose}
                            title={t('common.close')}
                            aria-label={t('common.close')}
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
                    <h1 style={{ color: 'black' }}>{t(`common.${title}`) ?? title}</h1>
                </div>
                {selector}
                {showEmptyState && images.length === 0 && !loading && <>{emptyState}</>}
                <div
                    className={style.gridContainer}
                    tabIndex={containerTabIndex}
                >
                    <div
                        className={`${style.imageGrid} ${extraGridClass ?? ''}`}
                        ref={containerRef}
                    >
                        {images.map((item, index) => renderItem(item, index))}
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

export default DatasetGalleryBase;
