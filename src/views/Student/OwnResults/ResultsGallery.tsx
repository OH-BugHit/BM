import { RefObject } from 'react';
import style from './results.module.css';
import { Button } from '@genai-fi/base';
import { useTranslation } from 'react-i18next';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import Results from './Results';

interface Props {
    currentData: {
        currentTerm: string;
        topCanv: RefObject<HTMLCanvasElement | null>;
        topHeat: RefObject<HTMLCanvasElement | null>;
    };
    doClose: () => void;
    openImage: HTMLCanvasElement | null;
    setOpenImage: React.Dispatch<React.SetStateAction<HTMLCanvasElement | null>>;
}

/**
 * Component shows a gallery of images from a dataset
 * @returns
 */
export function ResultsGallery({ currentData, doClose, openImage, setOpenImage }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <div
                className={style.resultGallery}
                inert={openImage ? true : undefined}
            >
                <Button
                    onClick={doClose}
                    variant="contained"
                    style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        zIndex: 3,
                        background: '#ffffffe7',
                        fontSize: 24,
                        cursor: 'pointer',
                        boxShadow: '-2px 3px 4px rgba(0, 0, 0, 0.4)',
                    }}
                    className={style.closeButton}
                    title={t('common.close')}
                    aria-label={t('common.close')}
                >
                    <CloseSharpIcon color="primary" />
                </Button>
                <div className={style.headerToggle}>
                    <h1 style={{ color: '#282828' }}>{t('student.titles.results')}</h1>
                </div>

                <Results
                    setOpenImage={setOpenImage}
                    currentData={currentData}
                />
            </div>
        </>
    );
}
