import style from './results.module.css';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { configAtom, labelsAtom, studentResultsAtom, topScoreAtom, usernameAtom } from '../../../atoms/state';
import { CanvasCopy } from '../../../components/CanvasCopy/CanvasCopy';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { Button } from '@genai-fi/base';
import { useSpoofProtocol } from '../../../services/StudentProtocol';
import { useTranslation } from 'react-i18next';
import { canvasToBase64 } from '../../../utils/canvasToBase64';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
    setOpenImage: Dispatch<SetStateAction<HTMLCanvasElement | null>>;
    currentData: {
        currentTerm: string;
        topCanv: RefObject<HTMLCanvasElement | null>;
        topHeat: RefObject<HTMLCanvasElement | null>;
    };
}

/**
 *
 * @param setOpenImage Setter for image to preview
 * @returns Result view
 */
export default function Results({ setOpenImage, currentData }: Props) {
    const { t } = useTranslation();
    const [results, setResults] = useAtom(studentResultsAtom);
    const config = useAtomValue(configAtom);
    const setScore = useSetAtom(topScoreAtom);
    const username = useAtomValue(usernameAtom);
    const labels = useAtomValue(labelsAtom);

    const { doSendImages } = useSpoofProtocol();

    /**
     * Sends top score result to teahcer for toggle hide.
     * (TODO: replace with lighter event such as hide image {term} that modifies hidden value at teacher)
     * This one is just shit
     */
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

    const slideVariants = {
        enter: { height: '0px', overflow: 'hidden' },
        center: { height: 'max-content' },
        exit: { height: '0px', overflow: 'hidden' },
    };

    return (
        <>
            <AnimatePresence mode="wait">
                {Array.from(results.data.entries()).map(([term, { score, topHeatmap, topCanvas, hidden }]) => (
                    <motion.div
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        key={term}
                    >
                        <h2>
                            {labels.labels.get(term) || term} {score}
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
                                            if (currentData.currentTerm === term) {
                                                setScore(0);
                                                currentData.topCanv.current = null;
                                                currentData.topHeat.current = null;
                                            }
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
                    </motion.div>
                ))}
            </AnimatePresence>
        </>
    );
}
