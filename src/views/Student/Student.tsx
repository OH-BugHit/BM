import { Button, Webcam } from '@genai-fi/base';
import { useLeaveWarning } from '../../hooks/useLeaveBlocker';
import { useSpoofProtocol } from '../../services/StudentProtocol';
import style from './style.module.css';
import { useAtom } from 'jotai';
import { SpoofConfig, StudentScore } from '../../utils/types';
import {
    classificationResultAtom,
    configAtom,
    menuShowTrainingDataAtom,
    modelAtom,
    profilePictureAtom,
    showOwnResultsAtom,
    studentBouncerAtom,
    studentResultsAtom,
    termTransferAtom,
    usernameAtom,
} from '../../atoms/state';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { classifyImage } from '../../utils/classifyImage';
import { canvasToBase64 } from '../../utils/canvasToBase64';
import { cloneCanvas } from '../../utils/cloneCanvas';
import { validateCanvas } from '../../utils/validateCanvas';
import { DatasetGallery } from '../DatasetGallery/DatasetGallery';
import StudentNavBar from '../StudentNavBar/StudentNavBar';
import { useModelNamesLoader } from '../../hooks/useModelNamesLoader';
import MessageDisplay from '../MessageDisplay/MessageDisplay';
import OwnResults from './OwnResults';

const hidePicture = false; // CHANGE TO COME FROM SETTINGS WHEN IMPLEMENTED

export default function Student({ serverCode }: { serverCode: string }) {
    const { t } = useTranslation();
    const { doSendImages, doRegister } = useSpoofProtocol();
    const [model] = useAtom(modelAtom);
    const [config] = useAtom<SpoofConfig>(configAtom);
    const [, setClassificationResult] = useAtom(classificationResultAtom);
    const [, setShowGallery] = useAtom(menuShowTrainingDataAtom);
    const [termData] = useAtom(termTransferAtom);
    const [username] = useAtom(usernameAtom);
    const [profilePicture] = useAtom(profilePictureAtom);
    const [trainingDataOpen] = useAtom(menuShowTrainingDataAtom);
    const [, setShowOwnResults] = useAtom(showOwnResultsAtom);
    const [bouncer] = useAtom(studentBouncerAtom);
    const [results, setResults] = useAtom(studentResultsAtom);
    const topCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const topHeatmapRef = useRef<HTMLCanvasElement | null>(null);
    const heatmapRef = useRef<HTMLCanvasElement | null>(null);
    const enlargedHeatmapRef = useRef<HTMLCanvasElement | null>(null);
    const sentRef = useRef(false);
    const blockRef = useRef(true);
    const [classifyTerm, setClassifyTerm] = useState<string>('');
    const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
    const [currentScore, setCurrentScore] = useState<number>(0);
    const [topScore, setScore] = useState<number>(0);
    const [pause, setPause] = useState<boolean>(false);
    const [remotePause, setRemotePause] = useState<boolean>(false);
    const [heatmap, setHeatmap] = useState<boolean>(false);
    const [remoteHeatmap, setRemoteHeatmap] = useState<boolean>(false);
    const [remoteGallery, setRemoteGallery] = useState<boolean>(false);
    const [webcamSize, setWebcamSize] = useState<number>(512); // Size of the webcam component
    const [allLabels, setAllLabels] = useState<string[]>([]);
    const [showError, setShowError] = useState(false);

    // Score circle buffer
    const scoreBufferRef = useRef<number[]>(Array(10).fill(0));
    const scoreIndexRef = useRef(0);
    const scoreSumRef = useRef(0);

    useLeaveWarning(blockRef); // Blocks unintended leaving
    useModelNamesLoader(); // Loads model names

    useEffect(() => {
        if (termData.term) {
            setClassifyTerm(termData.term);
            setScore(results.data.get(termData.term)?.score ?? 0);
            model?.setXAIClass(termData.term);
        }
        if (config.pause !== undefined) {
            setRemotePause(config.pause);
        }
        if (config.heatmap !== undefined) {
            setRemoteHeatmap(config.heatmap);
            if (!config.heatmap) setHeatmap(false);
        }
        if (config.gallery !== undefined) {
            setRemoteGallery(config.gallery);
            if (!config.gallery) setShowGallery(false);
        }
    }, [config, model, results, setShowGallery, termData]); // Update classify term and model class when config

    useEffect(() => {
        if (model) {
            setAllLabels(model.getLabels());
        }
    }, [model]);
    useEffect(() => {
        if (!sentRef.current && doRegister && username) {
            doRegister({ username, profilePicture });
            sentRef.current = true;
        }
    }, [doRegister, username, profilePicture]);

    useEffect(() => {
        if (model && heatmapRef.current) {
            model.setXAICanvas(heatmapRef.current);
        }
    }, [model, heatmapRef, webcamSize]); // webcamSize in case canvas size changes

    // Webcam's size adjustment on window resize
    useEffect(() => {
        const handleResize = () => {
            setWebcamSize(
                Math.min(Math.floor(window.innerWidth * 0.7), Math.floor(window.innerHeight * 0.6) * 0.7, 800)
            );
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const currentScore = results.data.get(classifyTerm)?.score ?? 0;
        const interval = setInterval(() => {
            if (topScore > currentScore && topCanvasRef.current && topHeatmapRef.current && doSendImages) {
                const imageBase64 = canvasToBase64(topCanvasRef.current);
                const heatmapBase64 = canvasToBase64(topHeatmapRef.current);
                // Send result to teacher
                doSendImages({
                    studentId: username,
                    classname: classifyTerm,
                    image: imageBase64,
                    heatmap: heatmapBase64,
                    score: topScore,
                    hidden: false,
                });
                // Save to own results
                setResults((old: { data: Map<string, StudentScore> }) => {
                    const newData = new Map(old.data);
                    newData.set(classifyTerm, {
                        score: topScore,
                        topHeatmap: topHeatmapRef.current,
                        topCanvas: topCanvasRef.current,
                        hidden: hidePicture,
                    });
                    return { data: newData };
                });
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [doSendImages, setResults, results.data, classifyTerm, topScore, username]);

    useEffect(() => {
        if (bouncer.reload) {
            blockRef.current = false;
            setShowError(true);
            setTimeout(() => {
                window.location.href = `/student/${serverCode}/main`;
            }, 8000);
        }
    }, [bouncer.reload, serverCode]);

    /**
     * Updates circular buffer.
     * @param newScore New score from classifier
     * @returns The mean of 10 last scores
     */
    function updateScoreBuffer(newScore: number): number {
        const buffer = scoreBufferRef.current;
        const idx = scoreIndexRef.current;
        const oldValue = buffer[idx];

        // scoreSum is updated with removing the oldest and adding most resent score
        scoreSumRef.current = scoreSumRef.current - oldValue + newScore;
        // we add the newScore to buffer
        buffer[idx] = newScore;
        // and move index
        scoreIndexRef.current = (idx + 1) % buffer.length;
        // returns the
        return Math.round((scoreSumRef.current / buffer.length) * 100) / 1000;
    }

    // Classify from canvas
    const handleCapture = useCallback(
        async (canvas: HTMLCanvasElement) => {
            if (!model || classifyTerm.length === 0 || pause || remotePause) return;
            if (validateCanvas(canvas)) {
                try {
                    const results = await classifyImage(model, canvas);
                    if (results) {
                        // working code continues
                        const result = results.predictions.filter((r) =>
                            r.className.toLowerCase().includes(`${classifyTerm.toLowerCase()}`)
                        );
                        if (result.length > 0) {
                            const rawScore = Math.floor(result[0].probability * 1000);
                            const smoothedScore = updateScoreBuffer(rawScore);

                            setCurrentScore(smoothedScore);

                            setScore((prevScore) => {
                                if (smoothedScore > prevScore) {
                                    topCanvasRef.current = canvas;
                                    if (heatmapRef.current) {
                                        topHeatmapRef.current = cloneCanvas(heatmapRef.current);
                                    }
                                    return smoothedScore;
                                }
                                return prevScore;
                            });
                        }
                        setClassificationResult(results.predictions.slice(0, 3)); // Top 3 storing (for TEMP view only)
                        if (heatmapRef.current && enlargedHeatmapRef.current) {
                            const src = heatmapRef.current;
                            const dst = enlargedHeatmapRef.current;
                            const ctx = dst.getContext('2d');
                            if (ctx) {
                                ctx.clearRect(0, 0, dst.width, dst.height);
                                ctx.drawImage(src, 0, 0, src.width, src.height, 0, 0, dst.width, dst.height);
                            }
                        }
                    }
                } catch (err) {
                    console.error('Luokittelu epäonnistui:', err);
                    setClassificationResult(null);
                }
            }
        },
        [model, classifyTerm, pause, remotePause, setClassificationResult]
    );

    return (
        <>
            <MessageDisplay open={showError} />
            <StudentNavBar
                title={`${username}`}
                pause={pause}
                setPause={setPause}
                remotePause={remotePause}
                heatmap={heatmap}
                setHeatmap={setHeatmap}
                remoteHeatmap={remoteHeatmap}
                remoteGallery={remoteGallery}
            />
            <OwnResults />
            {termData?.term && trainingDataOpen && allLabels.length !== 0 && (
                <div className={style.galleryContainer}>
                    <DatasetGallery allLabels={allLabels} />
                </div>
            )}
            <div className={style.container}>
                <div className={style.innerContainer}>
                    <div className={style.gameContainer}>
                        <h2>{classifyTerm && `${classifyTerm}`}</h2>
                        {!isCameraActive && (
                            <div className={style.cameraNotActive}>{t('webcam.notAvailable', 'Kamera käynnistyy')}</div>
                        )}
                        <div className={style.scoreBarContainer}>
                            <div className={style.currentScoreBar}>
                                <span style={{ width: `${Math.round(currentScore)}%` }}></span>
                            </div>
                            <div className={style.scoreBar}>
                                <span style={{ width: `${Math.round(topScore)}%` }}></span>
                            </div>

                            <div
                                className={style.scoreBarToolTip}
                                style={{ width: `${Math.round(topScore)}%` }}
                            >
                                <span data-label={topScore.toFixed(2)}></span>
                            </div>
                            <div
                                className={style.scoreBarCurrentToolTip}
                                style={{ width: `${Math.round(currentScore)}%` }}
                            >
                                <span data-label={currentScore.toFixed(2)}></span>
                            </div>
                        </div>
                        <div className={style.canvasContainer}>
                            <div style={{ display: 'none' }}>
                                <canvas
                                    ref={heatmapRef}
                                    width={224}
                                    height={224}
                                />
                            </div>
                            <div className={`${style.webcamWrapper} ${pause ? style.baseline : style.filtered}`}>
                                {(pause || remotePause) && <div className={style.overlayText}>Game paused</div>}
                                <Webcam
                                    size={webcamSize}
                                    interval={100}
                                    capture={!pause || !remotePause}
                                    disable={pause || remotePause}
                                    onCapture={handleCapture}
                                    hidden={false}
                                    onActivated={setIsCameraActive}
                                    onFatal={() => console.error('Webcam failure')}
                                />
                            </div>
                            {heatmap && (
                                <div className={style.heatmapContainer}>
                                    <canvas
                                        ref={enlargedHeatmapRef}
                                        width={webcamSize}
                                        height={webcamSize}
                                        className={style.heatmapCanvas}
                                    />
                                </div>
                            )}
                        </div>
                        <Button
                            onClick={() => setShowOwnResults((s) => !s)}
                            variant="contained"
                        >
                            Your results
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
