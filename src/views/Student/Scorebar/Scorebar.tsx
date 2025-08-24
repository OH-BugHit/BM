import style from './scorebar.module.css';
interface ScorebarProps {
    currentScore: number;
    topScore: number;
}
export default function Scorebar({ currentScore, topScore }: ScorebarProps) {
    return (
        <div className={style.scoreBarContainer}>
            <div className={style.currentScoreBar}>
                <span style={{ width: `${Math.round(currentScore)}%` }}></span>
            </div>
            <div className={style.scoreBar}>
                <span style={{ width: `${Math.round(topScore) + 4}%` }}></span>
            </div>

            <div
                className={style.scoreBarToolTip}
                style={{ width: `${Math.round(topScore)}%` }}
            >
                <span data-label={topScore.toFixed(2)}></span>
            </div>
            <div
                className={style.scoreBarCurrentToolTip}
                style={{ width: `${Math.round(currentScore)}%` }}
            >
                <span data-label={currentScore.toFixed(2)}></span>
            </div>
        </div>
    );
}
