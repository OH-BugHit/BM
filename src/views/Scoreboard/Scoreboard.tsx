import style from './style.module.css';
import { useTranslation } from 'react-i18next';
import { Button } from '@knicos/genai-base';
import { useState } from 'react';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { close } from '../../components/Buttons/buttonStyles';
import ClassSelect from './ClassSelect';
import Leaderboard from './Leaderboard';

export default function Scoreboard() {
    const { t } = useTranslation();

    const [openResult, setOpenResult] = useState<string | null>(null);
    const [openImage, setOpenImage] = useState<string | null>(null);

    return (
        <div className={style.innerContainer}>
            {openImage && (
                <div
                    className={style.openImageOverlay}
                    onClick={() => setOpenImage(null)}
                >
                    <div className={style.imageWrapper}>
                        <Button
                            onClick={() => setOpenImage(null)}
                            style={close}
                            title={t('common.close')}
                            aria-label="Sulje"
                        >
                            <CloseSharpIcon />
                        </Button>
                        <img
                            src={openImage}
                            alt="isompi kuva"
                            style={{ maxWidth: '90vw', maxHeight: '90vh', boxShadow: '0 0 24px #000' }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}

            <div className={style.termNamesContainer}>
                <ClassSelect
                    openResult={openResult}
                    setOpenResult={setOpenResult}
                />
            </div>
            <div className={style.resultsContainer}>
                <Leaderboard className={openResult} />
            </div>
        </div>
    );
    /*

    const overallScore = () => {
        let topScore = 0;
        scores.forEach((score) => {
            topScore += score.topScore;
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
    */
}
