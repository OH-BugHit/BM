import { useAtom, useSetAtom } from 'jotai';
import { activeViewAtom, isOutOfFocusAtom } from '../../atoms/state';
import style from './style.module.css';
import { useTranslation } from 'react-i18next';
import { Button } from '@genai-fi/base';

export default function ResultsButton({ landscape }: { landscape: boolean }) {
    const { t } = useTranslation();
    const [, setActiveView] = useAtom(activeViewAtom);
    const setIsOutOfFocus = useSetAtom(isOutOfFocusAtom);

    return (
        <Button
            className={landscape ? style.resultButtonLandscape : style.resultButtonPortrait}
            variant="contained"
            onClick={() => {
                setIsOutOfFocus(true);
                setActiveView((old) => ({
                    ...old,
                    overlay: old.overlay === 'ownResults' ? 'none' : 'ownResults',
                }));
            }}
        >
            {t('student.labels.ownResults')}
        </Button>
    );
}
