import style from './style.module.css';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { scoresAtom } from '../../atoms/state';
import { Button } from '@knicos/genai-base';

type Score = {
    className: string;
    lowScore: number;
    topScore: number;
    topCanvas: HTMLCanvasElement | null;
};

export default function ScoreList() {
    const [openIndices, setOpenIndices] = useState<{ [key: number]: boolean }>({});
    const [scores] = useAtom<Score[]>(scoresAtom);

    const toggleOpen = (idx: number) => {
        setOpenIndices((prev) => ({ ...prev, [idx]: !prev[idx] }));
    };

    const countScore = (score: Score) => {
        let points = '';
        points = (score.topScore - score.lowScore).toFixed(2);
        return `${points}`;
    };

    return (
        <div className={style.scoresContainer}>
            {scores.map((score, idx) => (
                <div
                    key={`${score.className}-${idx}`}
                    className={style.termItemContainer}
                >
                    <div className={style.termItemRow}>
                        <h1>{score.className}</h1>
                        <Button
                            variant="contained"
                            onClick={() => toggleOpen(idx)}
                        >
                            {openIndices[idx] ? 'Piilota tiedot' : 'Näytä tiedot'}
                        </Button>
                    </div>

                    <div className={openIndices[idx] ? style.scoreDetailsOpen : style.scoreDetails}>
                        {openIndices[idx] && (
                            <div>
                                <div style={{ justifyItems: 'center' }}>
                                    <div className={style.scoreBarContainer}>
                                        <div className={style.scoreBar}>
                                            <span style={{ width: `${countScore(score)}%` }}></span>
                                        </div>
                                        <div
                                            className={style.scoreBarToolTip}
                                            style={{ width: `${countScore(score)}%` }}
                                        >
                                            <span data-label={countScore(score)}></span>
                                        </div>
                                    </div>
                                </div>
                                {/* Lisää haluamaasi sisältöä */}
                                <h3>Paras kuva</h3>
                                <div className={style.topCanvasContainer}>
                                    <canvas
                                        className={style.topCanvas}
                                        ref={(el) => {
                                            if (el && score.topCanvas) {
                                                el.width = score.topCanvas.width;
                                                el.height = score.topCanvas.height;
                                                const ctx = el.getContext('2d');
                                                if (ctx) {
                                                    ctx.drawImage(score.topCanvas, 0, 0);
                                                }
                                            }
                                        }}
                                    ></canvas>
                                    <canvas
                                        className={style.topCanvas}
                                        ref={(el) => {
                                            if (el && score.topCanvas) {
                                                el.width = score.topCanvas.width;
                                                el.height = score.topCanvas.height;
                                                const ctx = el.getContext('2d');
                                                if (ctx) {
                                                    ctx.drawImage(score.topCanvas, 0, 0);
                                                }
                                            }
                                        }}
                                    ></canvas>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
