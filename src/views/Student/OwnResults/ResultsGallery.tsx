import { RefObject, useState } from 'react';
import style from './results.module.css';
import { Button } from '@genai-fi/base';
import { useTranslation } from 'react-i18next';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { CanvasCopy } from '../../../components/CanvasCopy/CanvasCopy';
import Results from './Results';
import { useSetAtom } from 'jotai';
import { activeViewAtom } from '../../../atoms/state';

interface Props {
    currentData: {
        currentTerm: string;
        topCanv: RefObject<HTMLCanvasElement | null>;
        topHeat: RefObject<HTMLCanvasElement | null>;
    };
}

/**
 * Component shows a gallery of images from a dataset
 * @returns
 */
export function ResultsGallery({ currentData }: Props) {
    const { t } = useTranslation();
    const [openImage, setOpenImage] = useState<HTMLCanvasElement | null>(null);
    const setActiveView = useSetAtom(activeViewAtom);

    return (
        <>
            <div className={style.resultGallery}>
                <div className={style.headerToggle}>
                    <h1 style={{ color: '#282828' }}>{t('student.titles.results')}</h1>
                </div>
                <Button
                    onClick={() =>
                        setActiveView((old) => ({
                            ...old,
                            overlay: 'none',
                        }))
                    }
                    variant="contained"
                    style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        zIndex: 3,
                        background: '#ffffffe7',
                        width: 32,
                        height: 32,
                        fontSize: 24,
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.81)',
                    }}
                >
                    <CloseSharpIcon color="primary" />
                </Button>
                <Results
                    setOpenImage={setOpenImage}
                    currentData={currentData}
                />
            </div>
            {openImage && (
                <div
                    className={style.openImageOverlay}
                    onClick={() => setOpenImage(null)}
                >
                    <>
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
                        <CanvasCopy
                            sourceCanvas={openImage}
                            width={Math.min(window.innerWidth - 32, 600)}
                            height={Math.min(window.innerWidth - 32, 600)}
                            maxWidth={Math.min(window.innerWidth, 600)}
                        />
                    </>
                </div>
            )}
        </>
    );
}
