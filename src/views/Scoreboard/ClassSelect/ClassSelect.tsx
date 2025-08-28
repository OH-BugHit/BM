import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import style from './classSelect.module.css';
import { labelsAtom, studentDataAtom } from '../../../atoms/state';
import { getClassNames } from './getClassNames';

interface Props {
    openResult: string | null;
    setOpenResult: (value: string | null) => void;
}

export default function ClassSelect({ openResult, setOpenResult }: Props) {
    const { t } = useTranslation();
    const [studentData] = useAtom(studentDataAtom);
    const [labels] = useAtom(labelsAtom);

    const allClassnames = getClassNames(studentData);

    const toggleMenu = (key: string | null) => {
        if (!openResult || openResult !== key) {
            setOpenResult(key);
        } else {
            setOpenResult(null);
        }
    };

    if (!studentData?.students) return <div>Ei kuvia</div>;
    // Renderöidään jokainen termi
    return (
        <div className={style.classSelect}>
            <button
                title={t('scoreboard.labels.forAll')}
                className={`${openResult === null ? style.selectedTermItem : style.termItem}`}
                onClick={() => toggleMenu(null)}
            >
                <h3>{t('scoreboard.labels.leaderboard')}</h3>
            </button>
            {[...allClassnames].sort().map((classname) => (
                <button
                    title={t('scoreboard.labels.forClass') + ' ' + labels.labels.get(classname)}
                    className={`${openResult === classname ? style.selectedTermItem : style.termItem}`}
                    key={classname}
                    onClick={() => toggleMenu(classname)}
                >
                    <h3>{labels.labels.get(classname)}</h3>
                </button>
            ))}
        </div>
    );
}
