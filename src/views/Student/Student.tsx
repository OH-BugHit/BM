import { Webcam } from '@knicos/genai-base';
import { useLeaveWarning } from '../../hooks/useLeaveBlocker';
import { useSpoofProtocol } from '../../services/StudentProtocol';
import style from './style.module.css';
import { useAtom } from 'jotai';
import { SpoofConfig } from '../../utils/types';
import {
    classificationResultAtom,
    configAtom,
    menuShowTrainingDataAtom,
    modelAtom,
    profilePictureAtom,
    studentBouncerAtom,
    termTransferAtom,
    usernameAtom,
} from '../../atoms/state';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { classifyImage } from '../../utils/classifyImage';
import { ClassificationResults } from '../../components/ClassificationResults/ClassificationResults';
import { canvasToBase64 } from '../../utils/canvasToBase64';
import { cloneCanvas } from '../../utils/cloneCanvas';
import { validateCanvas } from '../../utils/validateCanvas';
import { DatasetGallery } from '../DatasetGallery/DatasetGallery';
import StudentNavBar from '../StudentNavBar/StudentNavBar';
import { useModelNamesLoader } from '../../hooks/useModelNamesLoader';
import MessageDisplay from '../MessageDisplay/MessageDisplay';

export default function Student({ serverCode }: { serverCode: string }) {
    const { t } = useTranslation();
    const [model] = useAtom(modelAtom);
    const [, setClassificationResult] = useAtom(classificationResultAtom);
    const [username] = useAtom(usernameAtom);
    const [profilePicture] = useAtom(profilePictureAtom);
    const [classifyTerm, setClassifyTerm] = useState<string>('');
    const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
    const [currentScore, setCurrentScore] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [lastSentScore, setLastSentScore] = useState<number>(0);
    const [pause, setPause] = useState<boolean>(false);
    const [remotePause, setRemotePause] = useState<boolean>(false);
    const [heatmap, setHeatmap] = useState<boolean>(false);
    const [remoteHeatmap, setRemoteHeatmap] = useState<boolean>(false);
    const [remoteGallery, setRemoteGallery] = useState<boolean>(false);
    const [, setShowGallery] = useAtom(menuShowTrainingDataAtom);
    const topCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const topHeatmapRef = useRef<HTMLCanvasElement | null>(null);
    const [webcamSize, setWebcamSize] = useState<number>(
        Math.min(Math.floor(window.innerWidth * 0.7), Math.floor(window.innerHeight * 0.6) * 0.7, 800)
    ); // Size of the webcam component
    const { doSendImages, doRegister } = useSpoofProtocol();
    const [config] = useAtom<SpoofConfig>(configAtom);
    const [termData] = useAtom(termTransferAtom);
    const heatmapRef = useRef<HTMLCanvasElement | null>(null);
    const enlargedHeatmapRef = useRef<HTMLCanvasElement | null>(null);
    const sentRef = useRef(false);
    const [allLabels, setAllLabels] = useState<string[]>([]);
    const [trainingDataOpen] = useAtom(menuShowTrainingDataAtom);
    const [bouncer] = useAtom(studentBouncerAtom);
    const blockRef = useRef(true);
    const [showError, setShowError] = useState(false);

    useLeaveWarning(blockRef); // Blocks unintended leaving
    useModelNamesLoader(); // Loads model names

    useEffect(() => {
        if (termData.term) {
            setClassifyTerm(termData.term);
            setScore(0);
            setLastSentScore(0); // Reset last sent score when config changes
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
    }, [config, model, setShowGallery, termData]); // Update classify term and model class when config

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
        const interval = setInterval(() => {
            if (score > lastSentScore && topCanvasRef.current && topHeatmapRef.current && doSendImages) {
                const imageBase64 = canvasToBase64(topCanvasRef.current);
                const heatmapBase64 = canvasToBase64(topHeatmapRef.current);
                doSendImages({
                    studentId: username,
                    classname: classifyTerm,
                    image: imageBase64,
                    heatmap: heatmapBase64,
                    score: score,
                });
                setLastSentScore(score);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [doSendImages, classifyTerm, lastSentScore, score, username]);

    useEffect(() => {
        if (bouncer.reload) {
            blockRef.current = false;
            setShowError(true);
            setTimeout(() => {
                window.location.href = `/student/${serverCode}/main`;
            }, 5000);
        }
    }, [bouncer.reload, serverCode]);

    // Classify from canvas
    const handleCapture = async (canvas: HTMLCanvasElement) => {
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
                        const currentScore = Math.floor(result[0].probability * 10000) / 100;
                        setCurrentScore(currentScore);
                        setScore((prevScore) => {
                            if (currentScore > prevScore) {
                                topCanvasRef.current = canvas; // Save topCanvas topHeatmap to be sent at the next interval
                                if (heatmapRef.current) {
                                    topHeatmapRef.current = cloneCanvas(heatmapRef.current);
                                }
                                return currentScore;
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
    };

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
            {termData?.term && trainingDataOpen && allLabels.length !== 0 && (
                <div className={style.galleryContainer}>
                    <DatasetGallery allLabels={allLabels} />
                </div>
            )}
            <div className={style.container}>
                <div className={style.innerContainer}>
                    <div className={style.gameContainer}>
                        <h2>{classifyTerm && `Luokittelusana: \n${classifyTerm}`}</h2>
                        {!isCameraActive && (
                            <div className={style.cameraNotActive}>{t('webcam.notAvailable', 'Kamera käynnistyy')}</div>
                        )}
                        <div className={style.scoreBarContainer}>
                            <div className={style.currentScoreBar}>
                                <span style={{ width: `${Math.round(currentScore)}%` }}></span>
                            </div>
                            <div className={style.scoreBar}>
                                <span style={{ width: `${Math.round(score)}%` }}></span>
                            </div>

                            <div
                                className={style.scoreBarToolTip}
                                style={{ width: `${Math.round(score)}%` }}
                            >
                                <span data-label={score}></span>
                            </div>
                            <div
                                className={style.scoreBarCurrentToolTip}
                                style={{ width: `${Math.round(currentScore)}%` }}
                            >
                                <span data-label={currentScore}></span>
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
                        <ClassificationResults />
                    </div>
                </div>
            </div>
        </>
    );
}
