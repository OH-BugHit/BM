import { useAtom } from 'jotai';
import { useLeaveWarning } from '../../hooks/useLeaveBlocker';
import style from './style.module.css';
import { activeViewAtom, configAtom, modelAtom, selectedTermAtom } from '../../atoms/state';
import { useCallback, useEffect, useRef } from 'react';
import TermSelector from './TermSelector';
import { useTranslation } from 'react-i18next';
import UserList from './UserList';
import { TeacherDialogs } from '../../utils/types';
import ActionButton from '../Guidance/ActionButton';

export default function TermChange() {
    const { t } = useTranslation();
    const blockRef = useRef(true);
    useLeaveWarning(blockRef);
    const [config] = useAtom(configAtom);
    const [word, setWord] = useAtom(selectedTermAtom);
    const [model] = useAtom(modelAtom);
    const [activeView, setActiveView] = useAtom(activeViewAtom);

    useEffect(() => {
        setWord(word || '');
    }, [setWord, word]);

    const doShowDialog = useCallback(
        (dialog: TeacherDialogs) => {
            if (activeView.overlay === dialog) {
                setActiveView((old) => ({ ...old, overlay: 'none' }));
            } else setActiveView((old) => ({ ...old, overlay: dialog }));
        },
        [activeView, setActiveView]
    );

    return (
        <div className={style.termChange}>
            <div className={style.modeContainer}>
                {config.gameMode === 'all' && (
                    <div className={style.modeItem}>
                        <h1>{t('termSelect.titles.changeChallenge')}</h1>
                        {model?.getLabels().length !== 0 && (
                            <div className={style.selectorItem}>
                                <TermSelector />
                            </div>
                        )}
                    </div>
                )}
                {config.gameMode === 'single' && (
                    <div className={style.modeItem}>
                        <h1>{t('termSelect.titles.setSingle')}</h1>
                        <UserList />
                    </div>
                )}
            </div>
            <div className={style.modelChange}>
                <ActionButton
                    selected={activeView.overlay === 'modelChange'}
                    onAction={() => doShowDialog('modelChange')}
                    aria-label={t('teacher.labels.changeModel')}
                    action="changeModel"
                    color="primary"
                >
                    {t('teacher.labels.changeModel')}
                </ActionButton>
            </div>
            <div></div> {/*purpose of this is to be spacer*/}
        </div>
    );
}
