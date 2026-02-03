import style from './style.module.css';
import { Button } from '@genai-fi/base';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { useTranslation } from 'react-i18next';
import { Dispatch, useEffect, useState } from 'react';
import { SetStateAction } from 'jotai';

interface Props {
    setOpenImage: Dispatch<SetStateAction<string | null>>;
    openImage: string | null;
}

export default function OpenedImage({ setOpenImage, openImage }: Props) {
    const { t } = useTranslation();

    const [maxSize, setMaxSize] = useState<{ height: number; width: number }>({
        height: Math.floor(window.innerHeight * 0.7),
        width: Math.floor(window.innerWidth * 0.7),
    });
    useEffect(() => {
        const handleResize = () =>
            setMaxSize({
                height: Math.floor(window.innerHeight * 0.7),
                width: Math.floor(window.innerWidth * 0.7),
            });

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!openImage) {
        return;
    }

    return (
        <div
            className={style.openImageOverlay2}
            onClick={() => setOpenImage(null)}
        >
            <div className={style.imageContainer}>
                <img
                    src={openImage}
                    alt="isompi kuva"
                    width={'100%'}
                    height={'100%'}
                    style={{ objectFit: 'contain', maxHeight: maxSize.height, maxWidth: maxSize.width }}
                ></img>
            </div>
            <Button
                onClick={() => setOpenImage(null)}
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    zIndex: 3,
                    background: '#ffffffe7',
                    width: 32,
                    height: 32,
                    fontSize: 24,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.81)',
                }}
                title={t('common.close')}
                aria-label="Sulje"
            >
                <CloseSharpIcon />
            </Button>{' '}
        </div>
    );
}
