import { useEffect } from 'react';
import { useAtom } from 'jotai';
import {
    currentScoreAtom,
    labelsAtom,
    modelAtom,
    studentResultsAtom,
    termTransferAtom,
    topScoreAtom,
} from '../../../atoms/state';

interface Props {
    classifyTerm: string;
    setClassifyTerm: (t: string) => void;
    setTranslatedTerm: (t: string) => void;
    scoreBufferRef: React.RefObject<number[]>;
    scoreSumRef: React.RefObject<number>;
}

export default function TermWatcher({
    classifyTerm,
    setClassifyTerm,
    setTranslatedTerm,
    scoreBufferRef,
    scoreSumRef,
}: Props) {
    const [, setCurrentScore] = useAtom(currentScoreAtom);
    const [, setScore] = useAtom(topScoreAtom);
    const [model] = useAtom(modelAtom);
    const [results] = useAtom(studentResultsAtom);
    const [labels] = useAtom(labelsAtom);
    const [termData] = useAtom(termTransferAtom);

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
    }, [
        model,
        results,
        termData,
        classifyTerm,
        labels,
        setClassifyTerm,
        setCurrentScore,
        scoreBufferRef,
        scoreSumRef,
        setScore,
        setTranslatedTerm,
    ]);

    return null; // tämä ei renderöi mitään, vain logiikkaa
}
