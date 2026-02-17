import { useEffect, useRef, useCallback } from 'react';
import { useAtom } from 'jotai';
import {
    configAtom,
    currentScoreAtom,
    gameStartedAtom,
    modelAtom,
    studentControlsAtom,
    topScoreAtom,
} from '../../../atoms/state';
import { validateCanvas } from '../../../utils/validateCanvas';
import { classifyImage } from '../../../utils/classifyImage';
import { cloneCanvas } from '../../../utils/cloneCanvas';
interface Props {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    topCanvasRef: React.RefObject<HTMLCanvasElement | null>;
    topHeatmapRef: React.RefObject<HTMLCanvasElement | null>;
    heatmapRef: React.RefObject<HTMLCanvasElement | null>;
    scoreBufferRef: React.RefObject<number[]>;
    scoreSumRef: React.RefObject<number>;
    classifyTerm: string;
    interval?: number;
    isProseccing: React.RefObject<boolean>;
}

/**
 * Process score and calls for sending the score.
 * @param param0
 * @returns nothing to render so null
 */
export default function ScoreProcessor({
    canvasRef,
    topCanvasRef,
    topHeatmapRef,
    heatmapRef,
    scoreBufferRef,
    scoreSumRef,
    classifyTerm,
    interval,
    isProseccing,
}: Props) {
    const [model] = useAtom(modelAtom);
    const [controls] = useAtom(studentControlsAtom);
    const [config] = useAtom(configAtom);
    const [, setCurrentScore] = useAtom(currentScoreAtom);
    const [, setTopScore] = useAtom(topScoreAtom);
    const [gameReady, setGameReady] = useAtom(gameStartedAtom);
    const scoreIndexRef = useRef(0);

    const updateScoreBuffer = useCallback(
        (newScore: number) => {
            const buffer = scoreBufferRef.current!;
            const idx = scoreIndexRef.current;
            const oldValue = buffer[idx];

            scoreSumRef.current! = scoreSumRef.current! - oldValue + newScore;
            buffer[idx] = newScore;
            scoreIndexRef.current = (idx + 1) % buffer.length;

            return Math.round((scoreSumRef.current! / buffer.length) * 100) / 1000;
        },
        [scoreBufferRef, scoreSumRef]
    );

    const process = useCallback(async () => {
        if (!model || !canvasRef.current) return;
        isProseccing.current = true;
        try {
            if (!canvasRef.current || controls.pause || config.pause || classifyTerm.length === 0) {
                return;
            }
            const canvas = canvasRef.current;
            const heatmap = cloneCanvas(heatmapRef.current);

            if (!validateCanvas(canvas)) {
                return;
            }

            try {
                const results = await classifyImage(model, canvas);

                if (!results) {
                    return;
                }

                const filtered = results.predictions.filter((p) =>
                    p.className.toLowerCase().includes(classifyTerm.toLowerCase())
                );
                if (filtered.length === 0) {
                    return;
                }

                const rawScore = Math.floor(filtered[0].probability * 1000);
                const smoothedScore = updateScoreBuffer(rawScore);

                setCurrentScore(smoothedScore);
                // For loading spinner!
                if (!gameReady) {
                    setGameReady(true);
                }

                setTopScore((prev) => {
                    if (smoothedScore > prev) {
                        topCanvasRef.current = canvas;
                        topHeatmapRef.current = heatmap;
                        return smoothedScore;
                    }
                    return prev;
                });
            } catch (err) {
                console.error('Luokittelu epäonnistui:', err);
            }
        } finally {
            isProseccing.current = false;
        }
    }, [
        model,
        canvasRef,
        classifyTerm,
        controls.pause,
        config.pause,
        updateScoreBuffer,
        setCurrentScore,
        setTopScore,
        topCanvasRef,
        topHeatmapRef,
        heatmapRef,
        gameReady,
        setGameReady,
        isProseccing,
    ]);

    useEffect(() => {
        let cancelled = false;

        const loop = async () => {
            if (cancelled) return;
            if (!isProseccing.current) {
                await process();
            }
            if (!cancelled) {
                setTimeout(loop, interval);
            }
        };
        loop(); // Start the loop

        return () => {
            cancelled = true;
        };
    }, [process, interval, isProseccing]);

    return null; // Doesn not render anything
}
