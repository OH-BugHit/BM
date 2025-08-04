import style from './style.module.css';
import { useTranslation } from 'react-i18next';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { classificationResultAtom } from '../../../atoms/state';
import { Button, Webcam } from '@knicos/genai-base';
import { loadModel as loadModel } from '../../../services/loadModel';
import { classifyImage } from '../../../utils/classifyImage';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useLeaveWarning } from '../../../hooks/useLeaveBlocker';
import { ModelOrigin } from '../../../utils/types';
import ClassifierApp from '@genai-fi/classifier';
import { validateCanvas } from '../../../utils/validateCanvas';
import { ClassificationResults } from '../../../components/ClassificationResults/ClassificationResults';

/**
 * Bias game with own images using live webcam classification
 * @returns ExploitBiasGame view
 */
export default function Singleplayer() {
    const blockRef = useRef(true);
    const { t } = useTranslation();
    const [webcamSize, setWebcamSize] = useState(
        Math.min(Math.floor(window.innerWidth * 0.7), Math.floor(window.innerHeight * 0.6) * 0.7, 800)
    ); // Size of the webcam component
    const [model, setModel] = useState<ClassifierApp | null>(null);
    const [, setClassificationResult] = useAtom(classificationResultAtom);
    const [classifiedAs, setClassifiedAs] = useState('');
    const [isCameraActive, setIsCameraActive] = useState(true);
    const [captureOn, setCameraOn] = useState(false);

    const loaded = useRef(true);

    useEffect(() => {
        if (model === null && loaded.current) {
            const singleplayerModel = { origin: ModelOrigin.GenAI, name: 'animals2' }; // TODO: Hardcoded modelname for singleplayer. Do something if needed
            loadModel(singleplayerModel).then((loadedModel) => {
                if (loadedModel) {
                    setModel(loadedModel);
                }
            });
            loaded.current = false;
        }
        setClassificationResult(null);
    }, [model, setModel, setClassificationResult]);

    // Block accidental refresh
    useLeaveWarning(blockRef);

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
            if (validateCanvas(canvas)) {
                const results = await classifyImage(model, canvas);
                if (results) {
                    setClassifiedAs(results.nameOfMax);
                    setClassificationResult(
                        results.predictions.slice(0, 3).sort((a, b) => b.probability - a.probability)
                    ); // Top 3, sorted by probability
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
                title={t('common.title')}
                block={true}
            />
            <div className={style.innerContainer}>
                <h2>{classifiedAs && `Luokittelusana: \n${classifiedAs}`}</h2>
                {!isCameraActive && (
                    <div className={style.cameraNotActive}>{t('webcam.notAvailable', 'Kamera käynnistyy')}</div>
                )}
                <div className={`${style.webcamWrapper} ${style.filtered}`}>
                    <Webcam
                        size={webcamSize}
                        interval={100}
                        capture={captureOn}
                        disable={!captureOn}
                        onCapture={handleCapture}
                        hidden={false}
                        onActivated={setIsCameraActive}
                        onFatal={() => console.error('Webcam failure')}
                    />
                </div>

                <Button
                    sx={{ fontSize: '14pt', minWidth: '40px', marginTop: '6px' }}
                    variant="contained"
                    onClick={() => {
                        setCameraOn((prev) => !prev);
                    }}
                >
                    {captureOn ? <PauseIcon /> : <PlayArrowIcon />}
                </Button>
                <ClassificationResults />
            </div>
            <Footer />
        </div>
    );
}
