import { useAtom } from 'jotai';
import { configAtom, modelAtom, studentControlsAtom } from '../../../atoms/state';
import style from './webcamInput.module.css';
import { Spinner, Webcam } from '@genai-fi/base';
import { Dispatch, RefObject, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { validateCanvas } from '../../../utils/validateCanvas';
import { classifyImage } from '../../../utils/classifyImage';
import { cloneCanvas } from '../../../utils/cloneCanvas';
import { useTranslation } from 'react-i18next';

interface Props {
    setIsCameraActive: Dispatch<SetStateAction<boolean>>;
    scoreBufferRef: RefObject<number[]>;
    scoreSumRef: RefObject<number>;
    topScore: number;
    classifyTerm: string;
    setCurrentScore: Dispatch<SetStateAction<number>>;
    setScore: Dispatch<SetStateAction<number>>;
    topCanvasRef: RefObject<HTMLCanvasElement | null>;
    topHeatmapRef: RefObject<HTMLCanvasElement | null>;
}

export default function WebcamInput({
    setIsCameraActive,
    scoreBufferRef,
    scoreSumRef,
    topScore,
    classifyTerm,
    setCurrentScore,
    setScore,
    topCanvasRef,
    topHeatmapRef,
}: Props) {
    const [config] = useAtom(configAtom);
    const [model] = useAtom(modelAtom);
    const [webcamSize, setWebcamSize] = useState<number>(512); // Size of the webcam component
    const enlargedHeatmapRef = useRef<HTMLCanvasElement | null>(null);
    const scoreIndexRef = useRef(0);
    const heatmapRef = useRef<HTMLCanvasElement | null>(null);
    const [controls] = useAtom(studentControlsAtom);
    const { t } = useTranslation();

    useEffect(() => {
        if (model && heatmapRef.current) {
            model.setXAICanvas(heatmapRef.current);
        }
    }, [model, heatmapRef, webcamSize]); // webcamSize in case canvas size changes

    // Webcam's size adjustment on window resize
    useEffect(() => {
        const handleResize = () => {
            setWebcamSize(
                Math.floor(
                    Math.min(Math.floor(window.innerWidth * 0.7), Math.floor(window.innerHeight * 0.6) * 0.7, 800)
                )
            );
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /**
     * Updates circular buffer.
     * @param newScore New score from classifier
     * @returns The mean of 10 last scores
     */
    const updateScoreBuffer = useCallback(
        (newScore: number): number => {
            const buffer = scoreBufferRef.current;
            const idx = scoreIndexRef.current;
            const oldValue = buffer[idx];

            // scoreSum is updated with removing the oldest and adding most resent score
            scoreSumRef.current = scoreSumRef.current - oldValue + newScore;
            // we add the newScore to buffer
            buffer[idx] = newScore;
            // and move index
            scoreIndexRef.current = (idx + 1) % buffer.length;
            // returns the
            return Math.round((scoreSumRef.current / buffer.length) * 100) / 1000;
        },
        [scoreBufferRef, scoreSumRef]
    );

    // Classify from canvas
    const handleCapture = useCallback(
        async (canvas: HTMLCanvasElement) => {
            if (!model || classifyTerm.length === 0 || controls.pause || config.pause) return;
            if (validateCanvas(canvas)) {
                try {
                    const results = await classifyImage(model, canvas);
                    if (results) {
                        const result = results.predictions.filter((r) =>
                            r.className.toLowerCase().includes(`${classifyTerm.toLowerCase()}`)
                        );
                        if (result.length > 0) {
                            const rawScore = Math.floor(result[0].probability * 1000);
                            const smoothedScore = updateScoreBuffer(rawScore);
                            setCurrentScore(smoothedScore);
                            if (smoothedScore > topScore)
                                setScore(() => {
                                    topCanvasRef.current = cloneCanvas(canvas);
                                    topHeatmapRef.current = cloneCanvas(heatmapRef.current);
                                    return smoothedScore;
                                });
                        }
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
                }
            }
        },
        [
            topCanvasRef,
            topHeatmapRef,
            model,
            classifyTerm,
            controls.pause,
            topScore,
            config.pause,
            updateScoreBuffer,
            setCurrentScore,
            setScore,
        ]
    );

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
                <span
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translateX(-50%) translateY(-50%)',
                        zIndex: 0,
                        width: '100%',
                    }}
                >
                    <Spinner />
                </span>
                {(controls.pause || config.pause) && <div className={style.overlayText}>{t('common.paused')}</div>}
                <Webcam
                    size={webcamSize}
                    interval={250}
                    capture={!controls.pause || !config.pause}
                    disable={controls.pause || config.pause}
                    onCapture={handleCapture}
                    hidden={false}
                    onActivated={(e) => {
                        setIsCameraActive(e);
                    }}
                    direct
                />
            </div>
            {config.heatmap && controls.heatmap && (
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
    );
}
