import style from './style.module.css';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { CanvasCopy } from '../CanvasCopy/CanvasCopy';
import { Button } from '@genai-fi/base';
import { useAtom } from 'jotai';
import { studentDataAtom } from '../../atoms/state';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

interface ImageViewProps {
    maxSize: number;
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
export default function ImageView({ maxSize, openImage, setOpenImage }: ImageViewProps) {
    const [studentData] = useAtom(studentDataAtom);
    const { t } = useTranslation();
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
                            <>
                                <CanvasCopy
                                    sourceCanvas={
                                        studentData.students.get(openImage.student)?.data.get(openImage.className)
                                            ?.topCanvas
                                    }
                                    maxWidth={maxSize}
                                    width={maxSize}
                                    height={maxSize}
                                />
                                <CanvasCopy
                                    sourceCanvas={
                                        studentData.students.get(openImage.student)?.data.get(openImage.className)
                                            ?.topHeatmap
                                    }
                                    maxWidth={maxSize}
                                    width={maxSize}
                                    height={maxSize}
                                />
                            </>
                        )}
                        {openImage instanceof HTMLCanvasElement && (
                            <>
                                <CanvasCopy
                                    sourceCanvas={openImage}
                                    maxWidth={maxSize}
                                    width={maxSize}
                                    height={maxSize}
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
