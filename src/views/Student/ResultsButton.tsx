import { useAtom } from 'jotai';
import { activeViewAtom } from '../../atoms/state';
import style from './style.module.css';
import { useTranslation } from 'react-i18next';

export default function ResultsButton() {
    const { t } = useTranslation();
    const [, setActiveView] = useAtom(activeViewAtom);

    return (
        <button
            className={style.resultButton}
            onClick={() =>
                setActiveView((old) => ({
                    ...old,
                    overlay: old.overlay === 'ownResults' ? 'none' : 'ownResults',
                }))
            }
        >
            {t('student.labels.ownResults')}
        </button>
    );
}
