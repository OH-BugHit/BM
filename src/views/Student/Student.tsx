import { Button, Webcam } from '@knicos/genai-base';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import { useLeaveWarning } from '../../hooks/leaveBlocker';
import { useSpoofProtocol } from '../../services/StudentProtocol';
import style from './style.module.css';
import { useAtom } from 'jotai';
import { SpoofConfig } from '../../utils/types';
import { classificationResultAtom, configAtom, modelAtom } from '../../atoms/state';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { loadModel } from '../../services/loadModel';
import { classifyImage } from '../../utils/classifyImage';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { ClassificationResults } from '../../components/ClassificationResults/ClassificationResults';
import { canvasToBase64 } from '../../utils/canvasToBase64';
import { cloneCanvas } from '../../utils/cloneCanvas';

export default function Student() {
    const { t } = useTranslation();
    const [model, setModel] = useAtom(modelAtom);
    const [, setClassificationResult] = useAtom(classificationResultAtom);
    const [classifyTerm, setClassifyTerm] = useState<string>(''); //TODO: ota sana configista
    const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
    const [currentScore, setCurrentScore] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [lastSentScore, setLastSentScore] = useState<number>(0);
    const [pause, setPause] = useState<boolean>(false);
    const topCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const topHeatmapRef = useRef<HTMLCanvasElement | null>(null);
    const [webcamSize, setWebcamSize] = useState<number>(
        Math.min(Math.floor(window.innerWidth * 0.7), Math.floor(window.innerHeight * 0.6) * 0.7, 800)
    ); // Size of the webcam component
    const { doSendScore, doSendImages } = useSpoofProtocol();
    const [config] = useAtom<SpoofConfig>(configAtom);
    const heatmapRef = useRef<HTMLCanvasElement | null>(null);
    const enlargedHeatmapRef = useRef<HTMLCanvasElement | null>(null);

    useLeaveWarning(true); // Blocks unintended leaving

    useEffect(() => {
        setClassifyTerm(config.data);
        model?.setXAIClass(config.data); //TODO CASESENSITIVE TOISTAISEKSI!!
    }, [config.data, model]); // Update classify term and model class when config

    // Load model if needed
    useEffect(() => {
        if (!model) {
            loadModel().then((loadedModel) => {
                setModel(loadedModel);
            });
        }
        setScore(0);
    }, [model, setModel]);

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
            console.log('intervalli ', score, lastSentScore);
            if (score > lastSentScore && topCanvasRef.current && topHeatmapRef.current && doSendImages) {
                const imageBase64 = canvasToBase64(topCanvasRef.current);
                const heatmapBase64 = canvasToBase64(topHeatmapRef.current);
                doSendImages({
                    classname: classifyTerm,
                    image: imageBase64,
                    heatmap: heatmapBase64,
                });
                setLastSentScore(score);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [doSendImages, classifyTerm, lastSentScore, score]);

    // Classify from canvas
    const handleCapture = async (canvas: HTMLCanvasElement) => {
        if (!model) return;
        try {
            const results = await classifyImage(model, canvas);
            if (results) {
                // working code continues
                const result = results.predictions.filter((r) =>
                    r.className.toLowerCase().includes(`${classifyTerm.toLowerCase()}`)
                );
                if (!pause && result.length > 0) {
                    const currentScore = Math.floor(result[0].probability * 10000) / 100;
                    setCurrentScore(currentScore);
                    setScore((prevScore) => {
                        if (currentScore > prevScore) {
                            topCanvasRef.current = canvas; // Save topCanvas topHeatmap to be sent at the next interval
                            if (heatmapRef.current) {
                                topHeatmapRef.current = cloneCanvas(heatmapRef.current);
                            }
                            if (doSendScore) {
                                doSendScore({ classname: classifyTerm, score: currentScore });
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
    };

    return (
        <div className={style.container}>
            <Header
                title={'Student'}
                block={true}
            />
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
                    <div className={`${style.webcamWrapper} ${pause ? style.baseline : style.filtered}`}>
                        {pause && <div className={style.overlayText}>Game paused</div>}
                        <Webcam
                            size={webcamSize}
                            interval={100}
                            capture={!pause}
                            disable={pause}
                            onCapture={handleCapture}
                            hidden={false}
                            onActivated={setIsCameraActive}
                            onFatal={() => console.error('Webcam failure')}
                        />
                    </div>
                    <div style={{ display: 'none' }}>
                        <canvas
                            ref={heatmapRef}
                            width={224}
                            height={224}
                        />
                    </div>
                    <div className={style.heatmapContainer}>
                        <canvas
                            ref={enlargedHeatmapRef}
                            width={webcamSize}
                            height={webcamSize}
                            className={style.heatmapCanvas}
                        />
                    </div>
                    <ClassificationResults />
                    {
                        <Button
                            sx={{ fontSize: '14pt', minWidth: '40px', marginTop: '6px' }}
                            variant="contained"
                            onClick={() => {
                                setPause((prev) => !prev);
                            }}
                        >
                            {!pause ? <PauseIcon /> : <PlayArrowIcon />}
                        </Button>
                    }
                </div>
                <div className={style.topThreeContainer}>top 3</div>
                <div className={style.otherResultsContainer}>all else</div>
            </div>
            <Footer />
        </div>
    );
}
