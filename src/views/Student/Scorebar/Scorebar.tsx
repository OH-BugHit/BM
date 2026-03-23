import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import style from './scorebar.module.css';
import { currentScoreAtom, topScoreAtom } from '../../../atoms/state';

export default function Scorebar() {
    const [currentScore] = useAtom(currentScoreAtom);
    const [topScore] = useAtom(topScoreAtom);

    return (
        <div className={style.scoreBarContainer}>
            {/* Current Score bar */}
            <div
                className={style.currentScoreBar}
                role="meter"
                aria-label="Current score"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(currentScore)}
            >
                <motion.span
                    animate={{ width: `${Math.round(currentScore)}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                />
            </div>

            {/* Top Score bar */}
            <div
                className={style.scoreBar}
                role="meter"
                aria-label="Top score"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(topScore)}
            >
                <motion.span
                    animate={{ width: `${Math.round(topScore)}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                />
            </div>

            {/* Top Score tooltip */}
            <motion.div
                className={style.scoreBarToolTip}
                animate={{ width: `${Math.round(topScore)}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                aria-hidden="true"
            >
                <span data-label={topScore.toFixed(2)}></span>
            </motion.div>

            {/* Current Score tooltip */}
            <motion.div
                className={style.scoreBarCurrentToolTip}
                animate={{ width: `${Math.round(currentScore)}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                aria-hidden="true"
            >
                <span data-label={currentScore.toFixed(2)}></span>
            </motion.div>
        </div>
    );
}
