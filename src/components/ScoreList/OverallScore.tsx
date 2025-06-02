import { useAtom } from 'jotai';
import style from './style.module.css';
import { scoresAtom } from '../../atoms/state';
import { Score } from '../../utils/types';
import { useTranslation } from 'react-i18next';

export default function OverallScore() {
    const { t } = useTranslation();
    const [scores] = useAtom<Score[]>(scoresAtom);

    const overallScore = () => {
        let topScore = 0;
        let baseline = 0;
        scores.forEach((score) => {
            topScore += score.topScore;
            baseline += score.lowScore;
        });
        const fullscore = topScore;

        return (
            <div>
                <div style={{ justifyItems: 'center' }}>
                    <div className={style.scoreBarContainer}>
                        <div className={style.scoreBar}>
                            <span style={{ width: `${fullscore / scores.length}%` }}></span>
                        </div>
                        <div
                            className={style.scoreBarToolTip}
                            style={{ width: `${fullscore / scores.length}%` }}
                        >
                            <span data-label={fullscore.toFixed(2)}></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={style.overallScoreContainer}>
            {scores[0] ? (
                <>
                    <h2>{t('scores.overall')}</h2>
                    {overallScore()}
                </>
            ) : (
                <h3>Tapahtui virhe, lataa sivu uudelleen ja aloita alusta</h3>
            )}
        </div>
    );
}
