import style from './style.module.css';
import { settingAtom, topScoresAtom } from '../../atoms/state';
import { useAtom } from 'jotai';

interface Props {
    username: string;
    openResult: string | null;
}

export default function Crown({ username, openResult }: Props) {
    const [topScores] = useAtom(topScoresAtom);
    const [settings] = useAtom(settingAtom);

    const crown = () => {
        if (!openResult) {
            return null; // Selection has not been made
        }
        if (!topScores.scores.has(openResult)) {
            return null; // No scores for this term yet
        }
        if (topScores.scores.get(openResult)?.bestScore?.studentId === username) {
            return (
                <img
                    src="/aiKruunuSmall.png"
                    className={style.crownImg}
                    height="70"
                />
            );
        } else if (topScores.scores.get(openResult)?.secondScore?.studentId === username) {
            return (
                <img
                    src="/crownSilverSmall.png"
                    className={style.crownImg}
                    height="70"
                />
            );
        } else if (topScores.scores.get(openResult)?.thirdScore?.studentId === username) {
            return (
                <img
                    src="/crownBronzeSmall.png"
                    className={style.crownImg}
                    height="70"
                />
            );
        }
    };
    if (settings.userGridSettings.userGridShowCrowns !== true) return;
    return (
        <div className={style.crownWrapper}>
            <div className={style.crownImg}>{crown()}</div>
        </div>
    );
}
