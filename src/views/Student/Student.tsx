import { Button, Webcam } from '@knicos/genai-base';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import { useLeaveWarning } from '../../hooks/leaveBlocker';
import { useSpoofProtocol } from '../../services/StudentProtocol';
import style from './style.module.css';
import { useAtom } from 'jotai';
import { SpoofConfig } from '../../utils/types';
import { classificationResultAtom, configAtom, modelAtom } from '../../atoms/state';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { loadModel } from '../../services/loadModel';
import { classifyImage } from '../../utils/classifyImage';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { ClassificationResults } from '../../components/ClassificationResults/ClassificationResults';

export default function Student() {
    const { t } = useTranslation();
    const [model, setModel] = useAtom(modelAtom);
    const [, setClassificationResult] = useAtom(classificationResultAtom);
    const [classifyTerm, setClassifyTerm] = useState<string>(''); //TODO: ota sana configista
    const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
    const [currentScore, setCurrentScore] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [pause, setPause] = useState<boolean>(false);
    const [, setTopCanvas] = useState<HTMLCanvasElement | null>(null); //lisää topcanvas
    const [webcamSize, setWebcamSize] = useState<number>(
        Math.min(Math.floor(window.innerWidth * 0.7), Math.floor(window.innerHeight * 0.6) * 0.7, 800)
    ); // Size of the webcam component
    const { doSendScore, doSendImages } = useSpoofProtocol();
    const [config] = useAtom<SpoofConfig>(configAtom);

    useLeaveWarning(true); // Blocks unintended leaving

    useEffect(() => {
        setClassifyTerm(config.data);
    }, [config.data]);

    // Load model if needed
    useEffect(() => {
        if (!model) {
            loadModel().then((loadedModel) => {
                setModel(loadedModel);
            });
        }
        setScore(0);
    }, [model, setModel]);

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

    // Classify from canvas
    const handleCapture = async (canvas: HTMLCanvasElement) => {
        if (!model) return;
        try {
            const results = await classifyImage(model, canvas);
            if (results) {
                const result = results.predictions.filter((r) => r.className.toLowerCase().includes(`${classifyTerm}`));
                if (!pause && result.length > 0) {
                    const currentScore = Math.floor(result[0].probability * 10000) / 100;
                    setCurrentScore(currentScore);
                    setScore((prevScore) => {
                        if (currentScore >= prevScore) {
                            setTopCanvas(canvas);
                            return currentScore;
                        }
                        return prevScore;
                    });
                }
                setClassificationResult(results.predictions.slice(0, 3)); // Top 3
            }
        } catch (err) {
            console.error('Luokittelu epäonnistui:', err);
            setClassificationResult(null);
        }
    };

    const handleSendScore = () => {
        console.log('painettu lähetä');
        if (doSendScore && doSendImages) {
            console.log('sending data');
            doSendScore({ classname: classifyTerm, score: 1 });
            doSendImages({ classname: classifyTerm, image: 'kuva', heatmap: 'heatmap' });
        }
    };

    return (
        <div className={style.container}>
            <Header
                title={'Student'}
                block={true}
            />
            <div>
                {
                    <Button
                        sx={{ fontSize: '14pt', minWidth: '40px', marginTop: '6px' }}
                        variant="contained"
                        onClick={() => {
                            handleSendScore();
                        }}
                    >
                        Lähetä testiä
                    </Button>
                }
            </div>
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
