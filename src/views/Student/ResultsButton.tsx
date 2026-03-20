import { useAtom } from 'jotai';
import { activeViewAtom } from '../../atoms/state';
import style from './style.module.css';
import { useTranslation } from 'react-i18next';
import { Button } from '@genai-fi/base';

export default function ResultsButton({ landscape }: { landscape: boolean }) {
    const { t } = useTranslation();
    const [, setActiveView] = useAtom(activeViewAtom);

    return (
        <Button
            className={landscape ? style.resultButtonLandscape : style.resultButtonPortrait}
            variant="contained"
            onClick={() =>
                setActiveView((old) => ({
                    ...old,
                    overlay: old.overlay === 'ownResults' ? 'none' : 'ownResults',
                }))
            }
        >
            {t('student.labels.ownResults')}
        </Button>
    );
}
