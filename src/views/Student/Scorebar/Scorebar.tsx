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
            <div className={style.currentScoreBar}>
                <motion.span
                    animate={{ width: `${Math.round(currentScore)}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                />
            </div>

            {/* Top Score bar */}
            <div className={style.scoreBar}>
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
            >
                <span data-label={topScore.toFixed(2)}></span>
            </motion.div>

            {/* Current Score tooltip */}
            <motion.div
                className={style.scoreBarCurrentToolTip}
                animate={{ width: `${Math.round(currentScore)}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <span data-label={currentScore.toFixed(2)}></span>
            </motion.div>
        </div>
    );
}
