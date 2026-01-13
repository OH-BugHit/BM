import { useAtom } from 'jotai';
import { configAtom, modelAtom, studentControlsAtom } from '../../../atoms/state';
import style from './webcamInput.module.css';
import { Webcam } from '@genai-fi/base';
import { Dispatch, RefObject, SetStateAction, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ScoreProcessor from './ScoreProcessor';
import GameLoading from './GameLoading';

interface Props {
    setIsCameraActive: Dispatch<SetStateAction<boolean>>;
    scoreBufferRef: RefObject<number[]>;
    scoreSumRef: RefObject<number>;
    classifyTerm: string;
    topCanvasRef: RefObject<HTMLCanvasElement | null>;
    topHeatmapRef: RefObject<HTMLCanvasElement | null>;
}

export default function WebcamInput({
    setIsCameraActive,
    scoreBufferRef,
    scoreSumRef,
    classifyTerm,
    topCanvasRef,
    topHeatmapRef,
}: Props) {
    const [config] = useAtom(configAtom);
    const [model] = useAtom(modelAtom);
    const [controls] = useAtom(studentControlsAtom);
    const WEBCAMSIZE = Math.min(512, window.innerHeight - 264); // Size of the webcam component
    const webcamCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const heatmapRef = useRef<HTMLCanvasElement | null>(null);
    const isProseccing = useRef(false);
    const { t } = useTranslation();
    const interval = 100;

    useEffect(() => {
        if (model && heatmapRef.current) {
            model.setXAICanvas(heatmapRef.current);
        }
    }, [model]);

    // Classify from canvas
    const handleCapture = useCallback(async (canvas: HTMLCanvasElement) => {
        if (!isProseccing.current) {
            webcamCanvasRef.current = canvas;
        }
    }, []);

    return (
        <div className={style.canvasContainer}>
            <div className={`${style.webcamWrapper} ${controls.pause ? style.paused : style.filtered}`}>
                <GameLoading />
                {(controls.pause || config.pause) && <div className={style.overlayText}>{t('common.paused')}</div>}
                <div className={style.canvasWrapper}>
                    <Webcam
                        size={WEBCAMSIZE}
                        interval={interval}
                        capture={!controls.pause || (!config.pause && model !== null)}
                        disable={controls.pause || config.pause}
                        onCapture={handleCapture}
                        hidden={false}
                        onActivated={(e) => {
                            setIsCameraActive(e);
                        }}
                        direct
                    />
                    <div
                        className={` ${config.heatmap && controls.heatmap ? style.heatmapCanvas : style.hiddenCanvas}`}
                    >
                        <canvas
                            ref={heatmapRef}
                            width={224}
                            height={224}
                        />
                    </div>
                </div>
                <ScoreProcessor
                    canvasRef={webcamCanvasRef}
                    topCanvasRef={topCanvasRef}
                    topHeatmapRef={topHeatmapRef}
                    scoreBufferRef={scoreBufferRef}
                    heatmapRef={heatmapRef}
                    scoreSumRef={scoreSumRef}
                    classifyTerm={classifyTerm}
                    interval={interval}
                    isProseccing={isProseccing}
                />
            </div>
        </div>
    );
}
