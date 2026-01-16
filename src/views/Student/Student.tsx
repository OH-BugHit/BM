import { useLeaveWarning } from '../../hooks/useLeaveBlocker';
import { useSpoofProtocol } from '../../services/StudentProtocol';
import style from './style.module.css';
import { useAtomValue } from 'jotai';
import { profilePictureAtom, studentBouncerAtom, usernameAtom } from '../../atoms/state';
import { useEffect, useRef, useState } from 'react';
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
import { StudentDatasetWrapper } from '../DatasetGallery/StudentDatasetWrapper';
import { useTranslation } from 'react-i18next';

interface StudentProps {
    serverCode: string;
}

export default function Student({ serverCode }: StudentProps) {
    const { t } = useTranslation();
    const { doSendImages, doRegister } = useSpoofProtocol();
    const username = useAtomValue(usernameAtom);
    const profilePicture = useAtomValue(profilePictureAtom);
    const bouncer = useAtomValue(studentBouncerAtom);
    const topCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const topHeatmapRef = useRef<HTMLCanvasElement | null>(null);
    const sentRef = useRef(false);
    const blockRef = useRef(true);
    const [classifyTerm, setClassifyTerm] = useState<string>('');
    const [translatedTerm, setTranslatedTerm] = useState<string>('');
    const [showError, setShowError] = useState(false);

    //console.log('rendering student main view with values:', { username, profilePicture, bouncer, classifyTerm });

    // Score circle buffer refs, buffer is in WebcamInput for scores
    const scoreBufferRef = useRef<number[]>(Array(64).fill(0));
    const scoreSumRef = useRef(0);

    useLeaveWarning(blockRef); // Blocks unintended leaving (refreshing)
    useModelNamesLoader(); // Loads model names

    /**
     * Registers first!
     */
    useEffect(() => {
        if (!sentRef.current && doRegister && username) {
            doRegister({ username, profilePicture });
            sentRef.current = true;
        }
        console.log('registration effect', { sent: sentRef.current, username, profilePicture });
    }, [doRegister, username, profilePicture]);

    /**
     * Kicks user (by teacher) if bouncer.reload is set
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
                <StudentDatasetWrapper />
            </div>
            <div className={style.student}>
                <div className={style.gameContainer}>
                    {classifyTerm ? (
                        <h1 className={style.term}>{translatedTerm}</h1>
                    ) : (
                        <h2 style={{ color: 'white' }}>{t('student.titles.waitForLabel')}</h2>
                    )}
                    <Scorebar />
                    <div className={style.interfaceContainer}>
                        <div className={`${window.innerWidth > window.innerHeight ? style.landscape : style.portrait}`}>
                            {classifyTerm && (
                                <div>
                                    <WebcamInput
                                        scoreBufferRef={scoreBufferRef}
                                        scoreSumRef={scoreSumRef}
                                        topCanvasRef={topCanvasRef}
                                        topHeatmapRef={topHeatmapRef}
                                        classifyTerm={classifyTerm}
                                    />
                                </div>
                            )}
                            {!classifyTerm && <div className={style.waitingForTerm}>Waiting for term...</div>}
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
