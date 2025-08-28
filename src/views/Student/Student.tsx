import { Button } from '@genai-fi/base';
import { useLeaveWarning } from '../../hooks/useLeaveBlocker';
import { useSpoofProtocol } from '../../services/StudentProtocol';
import style from './style.module.css';
import { useAtom } from 'jotai';
import { StudentScore } from '../../utils/types';
import {
    activeViewAtom,
    configAtom,
    labelsAtom,
    modelAtom,
    profilePictureAtom,
    studentBouncerAtom,
    studentResultsAtom,
    studentSettingsAtom,
    termTransferAtom,
    usernameAtom,
} from '../../atoms/state';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { canvasToBase64 } from '../../utils/canvasToBase64';
import { DatasetGallery } from '../DatasetGallery/DatasetGallery';
import StudentNavBar from '../StudentNavBar/StudentNavBar';
import { useModelNamesLoader } from '../../hooks/useModelNamesLoader';
import MessageDisplay from '../MessageDisplay/MessageDisplay';
import OwnResults from './OwnResults/OwnResults';
import Scorebar from './Scorebar/Scorebar';
import WebcamInput from './WebcamInput/WebcamInput';
import StudentSettings from './StudentSettings/StudentSettings';

export default function Student({ serverCode }: { serverCode: string }) {
    const { t } = useTranslation();
    const { doSendImages, doRegister } = useSpoofProtocol();
    const [model] = useAtom(modelAtom);
    const [termData] = useAtom(termTransferAtom);
    const [username] = useAtom(usernameAtom);
    const [profilePicture] = useAtom(profilePictureAtom);
    const [bouncer] = useAtom(studentBouncerAtom);
    const [results, setResults] = useAtom(studentResultsAtom);
    const topCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const topHeatmapRef = useRef<HTMLCanvasElement | null>(null);
    const sentRef = useRef(false);
    const blockRef = useRef(true);
    const [classifyTerm, setClassifyTerm] = useState<string>('');
    const [translatedTerm, setTranslatedTerm] = useState<string>('');
    const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
    const [currentScore, setCurrentScore] = useState<number>(0);
    const [topScore, setScore] = useState<number>(0);
    const [showError, setShowError] = useState(false);
    const [activeView, setActiveView] = useAtom(activeViewAtom);
    const [config] = useAtom(configAtom);
    const [studentSettings] = useAtom(studentSettingsAtom);
    const [labels] = useAtom(labelsAtom);

    // Score circle buffer refs, buffer is in WebcamInput
    const scoreBufferRef = useRef<number[]>(Array(10).fill(0));
    const scoreSumRef = useRef(0);

    useLeaveWarning(blockRef); // Blocks unintended leaving
    useModelNamesLoader(); // Loads model names

    /**
     * If term changes!
     */
    useEffect(() => {
        if (termData.term !== classifyTerm) {
            setClassifyTerm(termData.term);
            const label = labels.labels.get(termData.term);
            setTranslatedTerm(label || termData.term);
            // Reset score
            scoreSumRef.current = 0;
            scoreBufferRef.current = Array(10).fill(0);
            setCurrentScore(0);
            setScore(results.data.get(termData.term)?.score ?? 0);
            model?.setXAIClass(termData.term);
        }
    }, [model, results, termData, classifyTerm, labels]); // Update classify term and model class when config

    /**
     * Registers first!
     */
    useEffect(() => {
        if (!sentRef.current && doRegister && username) {
            doRegister({ username, profilePicture });
            sentRef.current = true;
        }
    }, [doRegister, username, profilePicture]);

    /**
     * Send top score in 2 second intervals
     */
    useEffect(() => {
        const interval = setInterval(() => {
            const currentScore = results.data.get(classifyTerm)?.score ?? 0;
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
                    hidden: studentSettings.hidePictures,
                });
                // Save to own results
                setResults((old: { data: Map<string, StudentScore> }) => {
                    const newData = new Map(old.data);
                    newData.set(classifyTerm, {
                        score: topScore,
                        topHeatmap: topHeatmapRef.current,
                        topCanvas: topCanvasRef.current,
                        hidden: studentSettings.hidePictures,
                    });
                    return { data: newData };
                });
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [doSendImages, setResults, results.data, classifyTerm, topScore, username, studentSettings.hidePictures]);

    /**
     * Kicks user (by teacher)
     */
    useEffect(() => {
        if (bouncer.reload) {
            blockRef.current = false;
            setShowError(true);
            setTimeout(() => {
                window.location.href = `/student/${serverCode}/main`;
            }, 8000);
        }
    }, [bouncer.reload, serverCode]);

    return (
        <>
            <StudentSettings />
            <MessageDisplay open={showError} />
            <StudentNavBar />
            <OwnResults
                currentData={{
                    setScore: setScore,
                    currentTerm: classifyTerm,
                    topCanv: topCanvasRef,
                    topHeat: topHeatmapRef,
                }}
            />
            {config.gallery && activeView.overlay === 'trainingData' && (
                <div className={style.galleryContainer}>
                    <DatasetGallery />
                </div>
            )}
            <div //max height style removes bottom nav min height
                className={style.student}
                style={{ maxHeight: `${window.innerHeight - 64}px` }}
            >
                <div className={style.gameContainer}>
                    <h1 className={style.term}>{classifyTerm && `${translatedTerm}`}</h1>
                    {!isCameraActive && <div className={style.cameraNotActive}>{t('webcam.notAvailable')}</div>}
                    <Scorebar
                        currentScore={currentScore}
                        topScore={topScore}
                    />
                    <WebcamInput
                        scoreBufferRef={scoreBufferRef}
                        scoreSumRef={scoreSumRef}
                        topCanvasRef={topCanvasRef}
                        topHeatmapRef={topHeatmapRef}
                        classifyTerm={classifyTerm}
                        topScore={topScore}
                        setScore={setScore}
                        setCurrentScore={setCurrentScore}
                        setIsCameraActive={setIsCameraActive}
                    />
                    <Button
                        onClick={() =>
                            setActiveView((old) => ({
                                ...old,
                                overlay: old.overlay === 'ownResults' ? 'none' : 'ownResults',
                            }))
                        }
                        variant="contained"
                    >
                        {t('student.labels.ownResults')}
                    </Button>
                </div>
            </div>
        </>
    );
}
