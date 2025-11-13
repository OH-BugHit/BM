import { useCallback, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { studentResultsAtom, studentSettingsAtom, topScoreAtom } from '../../../atoms/state';
import { canvasToBase64 } from '../../../utils/canvasToBase64';
import { StudentScore } from '../../../utils/types';

interface Props {
    classifyTerm: string;
    topCanvasRef: React.RefObject<HTMLCanvasElement | null>;
    topHeatmapRef: React.RefObject<HTMLCanvasElement | null>;
    doSendImages?: (payload: {
        studentId: string;
        classname: string;
        image: string;
        heatmap: string;
        score: number;
        hidden: boolean;
    }) => void;
    username: string;
}

/**
 *
 * @param param0
 * @returns Renders nothing, just sends top score images at intervals
 */
export default function TopScoreSender({ classifyTerm, topCanvasRef, topHeatmapRef, doSendImages, username }: Props) {
    const [results, setResults] = useAtom(studentResultsAtom);
    const [studentSettings] = useAtom(studentSettingsAtom);
    const [topScore] = useAtom(topScoreAtom);
    const isSending = useRef(false);

    const sendScore = useCallback(() => {
        if (isSending.current) return; // estetään päällekkäisyys
        isSending.current = true;
        try {
            const currentScore = results.data.get(classifyTerm)?.score ?? 0;
            if (topScore > currentScore && topCanvasRef.current && topHeatmapRef.current && doSendImages) {
                const imageBase64 = canvasToBase64(topCanvasRef.current);
                const heatmapBase64 = canvasToBase64(topHeatmapRef.current);

                // Lähetä opettajalle
                doSendImages({
                    studentId: username,
                    classname: classifyTerm,
                    image: imageBase64,
                    heatmap: heatmapBase64,
                    score: topScore,
                    hidden: studentSettings.hidePictures,
                });

                // Päivitä omiin tuloksiin
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
        } finally {
            isSending.current = false;
        }
    }, [
        classifyTerm,
        doSendImages,
        results.data,
        setResults,
        studentSettings.hidePictures,
        topCanvasRef,
        topHeatmapRef,
        topScore,
        username,
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            sendScore();
        }, 2000);

        return () => clearInterval(interval);
    }, [sendScore]);

    return null;
}
