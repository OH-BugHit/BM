import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import style from './classSelect.module.css';
import { labelsAtom, studentDataAtom } from '../../../atoms/state';
import { getClassNames } from './getClassNames';

interface Props {
    openResult: string | null;
    setOpenResult: (value: string | null) => void;
    blockOverall?: boolean;
}

/**
 * Component for selecting class. Labels are fetched from Labels atom.
 * Column shows overall button (or not, depending on prop) and buttons for each class name found
 * Selected class is set with setOpenResult
 * @param param0 active class name (or null for overall)
 * @param param1 setter for active class name
 * @param param2 if true, overall button is not shown
 * @returns Class selection component
 */
export default function ClassSelect({ openResult, setOpenResult, blockOverall }: Props) {
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

    return (
        <div className={style.classSelect}>
            {blockOverall || (
                <button
                    title={t('scoreboard.labels.forAll')}
                    className={`${openResult === null ? style.selectedTermItem : style.termItem}`}
                    onClick={() => toggleMenu(null)}
                >
                    <h3>{t('scoreboard.labels.leaderboard')}</h3>
                </button>
            )}
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
