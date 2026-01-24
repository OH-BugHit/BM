import { useAtomValue, useSetAtom } from 'jotai';
import { cameraActivatedAtom, modelAtom } from '../../../atoms/state';
import style from './webcamInput.module.css';
import React, { RefObject, useCallback, useEffect, useRef } from 'react';
import ScoreProcessor from './ScoreProcessor';
import GameLoading from './GameLoading';
import { Webcam } from '@genai-fi/base';
import NotAvailable from './NotAvailable';
import PauseLayer from './PauseLayer';
import HeatmapLayer from './HeatmapLayer';

interface Props {
    scoreBufferRef: RefObject<number[]>;
    scoreSumRef: RefObject<number>;
    classifyTerm: string;
    topCanvasRef: RefObject<HTMLCanvasElement | null>;
    topHeatmapRef: RefObject<HTMLCanvasElement | null>;
}

function WebcamInput({ scoreBufferRef, scoreSumRef, classifyTerm, topCanvasRef, topHeatmapRef }: Props) {
    console.log('rendering webcam input');
    const model = useAtomValue(modelAtom);
    const setCameraActivated = useSetAtom(cameraActivatedAtom);
    const WEBCAMSIZE = Math.min(512, window.innerHeight - 264); // Size of the webcam component
    const webcamCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const heatmapRef = useRef<HTMLCanvasElement | null>(null);
    const isProseccing = useRef(false);
    const interval = 150;

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
            <div className={style.webcamWrapper}>
                <GameLoading />
                <NotAvailable />
                <PauseLayer />
                <div className={style.canvasWrapper}>
                    <Webcam
                        size={WEBCAMSIZE}
                        interval={interval}
                        capture={model !== null}
                        onCapture={handleCapture}
                        hidden={false}
                        onActivated={(e) => {
                            setCameraActivated(e);
                        }}
                    />
                    <HeatmapLayer heatmapRef={heatmapRef} />
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
export default React.memo(WebcamInput);
