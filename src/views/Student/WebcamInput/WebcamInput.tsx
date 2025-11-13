import { useAtom } from 'jotai';
import { configAtom, modelAtom, studentControlsAtom } from '../../../atoms/state';
import style from './webcamInput.module.css';
import { Spinner, Webcam } from '@genai-fi/base';
import { Dispatch, RefObject, SetStateAction, useCallback, useEffect, useRef } from 'react';
import { cloneCanvas } from '../../../utils/cloneCanvas';
import { useTranslation } from 'react-i18next';
import ScoreProcessor from './ScoreProcessor';

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
    const enlargedHeatmapRef = useRef<HTMLCanvasElement | null>(null);
    const webcamCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const heatmapRef = useRef<HTMLCanvasElement | null>(null);
    const { t } = useTranslation();
    const interval = 200;

    useEffect(() => {
        if (model && heatmapRef.current) {
            model.setXAICanvas(heatmapRef.current);
        }
    }, [model, heatmapRef]);

    // Classify from canvas
    const handleCapture = useCallback(async (canvas: HTMLCanvasElement) => {
        webcamCanvasRef.current = cloneCanvas(canvas);
    }, []);

    return (
        <div className={style.canvasContainer}>
            <div style={{ display: 'none' }}>
                <canvas
                    ref={heatmapRef}
                    width={224}
                    height={224}
                />
            </div>
            <div className={`${style.webcamWrapper} ${controls.pause ? style.paused : style.filtered}`}>
                {/*TODO: Test if this helps on loading spinner?*/}
                {!model?.isReady() && (
                    <span
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translateX(-50%) translateY(-50%)',
                            zIndex: 1,
                            width: '100%',
                        }}
                    >
                        <Spinner />
                    </span>
                )}

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
                    {config.heatmap && controls.heatmap && (
                        <div className={style.heatmapContainer}>
                            <canvas
                                ref={enlargedHeatmapRef}
                                width={WEBCAMSIZE}
                                height={WEBCAMSIZE}
                                className={style.heatmapCanvas}
                            />
                        </div>
                    )}
                </div>
                <ScoreProcessor
                    enlargedHeatmapRef={enlargedHeatmapRef}
                    canvasRef={webcamCanvasRef}
                    topCanvasRef={topCanvasRef}
                    topHeatmapRef={topHeatmapRef}
                    scoreBufferRef={scoreBufferRef}
                    heatmapRef={heatmapRef}
                    scoreSumRef={scoreSumRef}
                    classifyTerm={classifyTerm}
                    interval={interval}
                />
            </div>
        </div>
    );
}
