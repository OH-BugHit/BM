import { Dispatch, RefObject, useState } from 'react';
import style from './results.module.css';
import { Button } from '@genai-fi/base';
import { useTranslation } from 'react-i18next';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { CanvasCopy } from '../../../components/CanvasCopy/CanvasCopy';
import { close } from '../../../components/Buttons/buttonStyles';
import Results from './Results';
import { SetStateAction } from 'jotai';

interface Props {
    currentData: {
        currentTerm: string;
        topCanv: RefObject<HTMLCanvasElement | null>;
        topHeat: RefObject<HTMLCanvasElement | null>;
        setScore: Dispatch<SetStateAction<number>>;
    };
}

/**
 * Component shows a gallery of images from a dataset
 * @returns
 */
export function ResultsGallery({ currentData }: Props) {
    const { t } = useTranslation();
    const [openImage, setOpenImage] = useState<HTMLCanvasElement | null>(null);

    return (
        <>
            <div className={style.resultGallery}>
                <div className={style.headerToggle}>
                    <h1>{t('student.titles.results')}</h1>
                </div>
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
                            style={close}
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
