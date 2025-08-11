import { useState } from 'react';
import style from './results.module.css';
import { Button } from '@knicos/genai-base';
import { useTranslation } from 'react-i18next';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { close } from '../../components/Buttons/buttonStyles';
import { CanvasCopy } from '../../components/CanvasCopy/CanvasCopy';
import { useSpoofProtocol } from '../../services/StudentProtocol';
import { configAtom, studentResultsAtom, usernameAtom } from '../../atoms/state';
import { useAtom } from 'jotai';
import { canvasToBase64 } from '../../utils/canvasToBase64';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

/**
 * Component shows a gallery of images from a dataset
 * @returns
 */
export function ResultsGallery() {
    const { t } = useTranslation();
    const [openImage, setOpenImage] = useState<HTMLCanvasElement | null>(null);
    const [username] = useAtom(usernameAtom);
    const [results, setResults] = useAtom(studentResultsAtom);
    const [config] = useAtom(configAtom);

    const { doSendImages } = useSpoofProtocol();

    const handleSendImages = ({
        hide,
        term,
        score,
        topHeatmap,
        topCanvas,
    }: {
        hide: boolean;
        term: string;
        score: number | undefined;
        topCanvas: HTMLCanvasElement | null | undefined;
        topHeatmap: HTMLCanvasElement | null | undefined;
    }) => {
        if (!doSendImages || !topCanvas || !topHeatmap || !score) {
            console.error('doSendImages function or canvases are not available');
            return;
        }
        const imageBase64 = canvasToBase64(topCanvas);
        const heatmapBase64 = canvasToBase64(topHeatmap);
        doSendImages({
            studentId: username,
            classname: term,
            image: imageBase64,
            heatmap: heatmapBase64,
            score: score,
            hidden: hide,
        });
        setResults((prev) => {
            const newData = new Map(prev.data);
            newData.set(term, {
                score,
                topCanvas: topCanvas,
                topHeatmap: topHeatmap,
                hidden: hide,
            });
            return { data: newData };
        });
    };

    const images = () => {
        return Array.from(results.data.entries()).map(([term, { score, topHeatmap, topCanvas, hidden }]) => (
            <div key={term}>
                <h2>
                    {term} {score}
                </h2>
                <div className={style.imageColumn}>
                    <div className={style.imagesContainer}>
                        <div
                            className={style.image}
                            onClick={() => setOpenImage(topCanvas || null)}
                        >
                            <CanvasCopy sourceCanvas={topCanvas} />
                            {hidden && (
                                <div className={style.hiddenTag}>
                                    <VisibilityOffIcon
                                        fontSize="large"
                                        color="action"
                                    />
                                </div>
                            )}
                        </div>
                        <div
                            className={style.image}
                            onClick={() => setOpenImage(topHeatmap || null)}
                        >
                            <CanvasCopy sourceCanvas={topHeatmap} />
                            {hidden && (
                                <div className={style.hiddenTag}>
                                    <VisibilityOffIcon
                                        fontSize="large"
                                        color="action"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    {(config.settings.allowHidePicture || config.settings.allowResetTerm) && (
                        <div className={style.buttonContainer}>
                            <Button
                                color="primary"
                                variant={'contained'}
                                onClick={() =>
                                    handleSendImages({
                                        hide: !hidden,
                                        term,
                                        score,
                                        topCanvas,
                                        topHeatmap,
                                    })
                                }
                                disabled={!config.settings.allowHidePicture}
                            >
                                {hidden ? t('student.actions.show') : t('student.actions.hide')}
                            </Button>
                            <Button
                                color="error"
                                variant={'contained'}
                                onClick={() => {
                                    setResults((prev) => {
                                        const newData = new Map(prev.data);
                                        newData.delete(term);
                                        return { data: newData };
                                    });
                                    if (doSendImages)
                                        doSendImages({
                                            studentId: username,
                                            classname: term,
                                            image: 'delete',
                                            heatmap: 'delete',
                                            score: 'delete',
                                            hidden: 'delete',
                                        });
                                }}
                                disabled={!config.settings.allowResetTerm}
                            >
                                {t('student.actions.deleteProgress')}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        ));
    };

    return (
        <>
            <div className={style.resultGallery}>
                <div className={style.headerToggle}>
                    <h1>{t('student.titles.results')}</h1>
                </div>
                {images()}
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
