import style from './style.module.css';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { CanvasCopy } from '../CanvasCopy/CanvasCopy';
import { Button } from '@genai-fi/base';
import { useAtom } from 'jotai';
import { studentDataAtom } from '../../atoms/state';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ImageViewProps {
    openImage: { student: string; className: string } | null | HTMLCanvasElement | undefined;
    setOpenImage: Dispatch<
        SetStateAction<
            | HTMLCanvasElement
            | {
                  student: string;
                  className: string;
              }
            | null
            | undefined
        >
    >;
}

/**
 *
 * @param maxSize is maximum size of the picture
 * @param openImage refers to image currently open
 * @param setOpenImage setter for image to open
 * @returns return view with opened image
 */
export default function ImageView({ openImage, setOpenImage }: ImageViewProps) {
    const [studentData] = useAtom(studentDataAtom);
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

    return (
        <>
            {openImage && (
                <div
                    className={style.openImageOverlay}
                    onClick={() => setOpenImage(null)}
                >
                    <div className={style.topPictureContainer}>
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
                        </Button>
                        {!(openImage instanceof HTMLCanvasElement) && (
                            <div
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: '1rem',
                                    width: '100vw',
                                    justifyContent: 'space-evenly',
                                }}
                            >
                                <CanvasCopy
                                    sourceCanvas={
                                        studentData.students.get(openImage.student)?.data.get(openImage.className)
                                            ?.topCanvas
                                    }
                                    maxWidth={Math.floor(Math.min(maxSize.height, maxSize.width / 2))}
                                    maxHeight={maxSize.height}
                                    width={Math.floor(Math.min(maxSize.height, maxSize.width / 2))}
                                    height={Math.floor(Math.min(maxSize.height, maxSize.width / 2))}
                                />
                                <CanvasCopy
                                    sourceCanvas={
                                        studentData.students.get(openImage.student)?.data.get(openImage.className)
                                            ?.topHeatmap
                                    }
                                    maxWidth={Math.floor(Math.min(maxSize.height, maxSize.width / 2))}
                                    maxHeight={maxSize.height}
                                    width={Math.floor(Math.min(maxSize.height, maxSize.width / 2))}
                                    height={Math.floor(Math.min(maxSize.height, maxSize.width / 2))}
                                />
                            </div>
                        )}
                        {openImage instanceof HTMLCanvasElement && (
                            <div onClick={(e) => e.stopPropagation()}>
                                <CanvasCopy
                                    sourceCanvas={openImage}
                                    maxWidth={maxSize.width}
                                    maxHeight={maxSize.height}
                                    width={'100%'}
                                    height={maxSize.height}
                                    noBorder={true}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
