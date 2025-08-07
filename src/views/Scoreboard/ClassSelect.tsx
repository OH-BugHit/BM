import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import style from './style.module.css';
import { studentDataAtom } from '../../atoms/state';

interface Props {
    openResult: string | null;
    setOpenResult: (value: string | null) => void;
}

export default function ClassSelect({ openResult, setOpenResult }: Props) {
    const { t } = useTranslation();
    const [studentData] = useAtom(studentDataAtom);

    const allClassnames = new Set<string>();

    const toggleMenu = (key: string | null) => {
        if (!openResult || openResult !== key) {
            setOpenResult(key);
        } else {
            setOpenResult(null);
        }
    };

    if (!studentData?.students) return <div>Ei kuvia</div>;

    // Kerätään kaikki mahdolliset classnamet kaikilta opiskelijoilta
    for (const studentScores of studentData.students.values()) {
        for (const classname of studentScores.data.keys()) {
            allClassnames.add(classname);
        }
    }

    // Renderöidään jokainen termi
    return (
        <>
            <h1>{t('scoreboard.labels.scores')}</h1>
            <div
                className={`${openResult === null ? style.selectedTermItem : style.termItem}`}
                onClick={() => toggleMenu(null)}
            >
                <h3>{t('scoreboard.labels.leaderboard')}</h3>
            </div>
            {[...allClassnames].sort().map((classname) => {
                return (
                    <div
                        className={`${openResult === classname ? style.selectedTermItem : style.termItem}`}
                        key={classname}
                        onClick={() => toggleMenu(classname)}
                    >
                        <h3>{classname}</h3>
                    </div>
                );
            })}
        </>
    );
}
