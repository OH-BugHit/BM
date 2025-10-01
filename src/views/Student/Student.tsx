import { useLeaveWarning } from '../../hooks/useLeaveBlocker';
import { useSpoofProtocol } from '../../services/StudentProtocol';
import style from './style.module.css';
import { useAtom } from 'jotai';
import { profilePictureAtom, studentBouncerAtom, usernameAtom } from '../../atoms/state';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import StudentNavBar from '../StudentNavBar/StudentNavBar';
import { useModelNamesLoader } from '../../hooks/useModelNamesLoader';
import MessageDisplay from '../MessageDisplay/MessageDisplay';
import OwnResults from './OwnResults/OwnResults';
import Scorebar from './Scorebar/Scorebar';
import WebcamInput from './WebcamInput/WebcamInput';
import StudentSettings from './StudentSettings/StudentSettings';
import TermWatcher from './StudentComponents/TermWatcher';
import TopScoreSender from './StudentComponents/TopScoreSender';
import ResultsButton from './ResultsButton';
import { DatasetGalleryWrapper } from '../DatasetGallery/DatasetGalleryWrapper';

interface StudentProps {
    serverCode: string;
}

export default function Student({ serverCode }: StudentProps) {
    const { t } = useTranslation();
    const { doSendImages, doRegister } = useSpoofProtocol();
    const [username] = useAtom(usernameAtom);
    const [profilePicture] = useAtom(profilePictureAtom);
    const [bouncer] = useAtom(studentBouncerAtom);
    const topCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const topHeatmapRef = useRef<HTMLCanvasElement | null>(null);
    const sentRef = useRef(false);
    const blockRef = useRef(true);
    const [classifyTerm, setClassifyTerm] = useState<string>('');
    const [translatedTerm, setTranslatedTerm] = useState<string>('');
    const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
    const [showError, setShowError] = useState(false);

    // Score circle buffer refs, buffer is in WebcamInput
    const scoreBufferRef = useRef<number[]>(Array(64).fill(0));
    const scoreSumRef = useRef(0);

    useLeaveWarning(blockRef); // Blocks unintended leaving
    useModelNamesLoader(); // Loads model names

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
            <TermWatcher
                classifyTerm={classifyTerm}
                setClassifyTerm={setClassifyTerm}
                setTranslatedTerm={setTranslatedTerm}
                scoreBufferRef={scoreBufferRef}
                scoreSumRef={scoreSumRef}
            />

            <TopScoreSender
                classifyTerm={classifyTerm}
                topCanvasRef={topCanvasRef}
                topHeatmapRef={topHeatmapRef}
                doSendImages={doSendImages}
                username={username}
            />
            <StudentSettings />
            <MessageDisplay open={showError} />
            <StudentNavBar />
            <OwnResults
                currentData={{
                    currentTerm: classifyTerm,
                    topCanv: topCanvasRef,
                    topHeat: topHeatmapRef,
                }}
            />
            <div className={style.galleryContainer}>
                <DatasetGalleryWrapper />
            </div>
            <div className={style.student}>
                <div className={style.gameContainer}>
                    <h1 className={style.term}>{classifyTerm && `${translatedTerm}`}</h1>
                    {!isCameraActive && <div className={style.cameraNotActive}>{t('webcam.notAvailable')}</div>}
                    <Scorebar />
                    <div className={style.interfaceContainer}>
                        <div className={`${window.innerWidth > window.innerHeight ? style.landscape : style.portrait}`}>
                            <div>
                                <WebcamInput
                                    scoreBufferRef={scoreBufferRef}
                                    scoreSumRef={scoreSumRef}
                                    topCanvasRef={topCanvasRef}
                                    topHeatmapRef={topHeatmapRef}
                                    classifyTerm={classifyTerm}
                                    setIsCameraActive={setIsCameraActive}
                                />
                            </div>
                            <div className={style.gameLowerStuff}>
                                <ResultsButton />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
