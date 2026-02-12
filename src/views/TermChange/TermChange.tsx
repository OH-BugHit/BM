import { useAtom, useAtomValue } from 'jotai';
import { useLeaveWarning } from '../../hooks/useLeaveBlocker';
import style from './style.module.css';
import { activeViewAtom, configAtom, modelAtom, selectedTermAtom } from '../../atoms/state';
import { useCallback, useEffect, useRef } from 'react';
import TermSelector from './TermSelector';
import { useTranslation } from 'react-i18next';
import UserList from './UserList';
import ActionButton from '../Guidance/ActionButton';
import { useLocation, useNavigate } from 'react-router';

export default function TermChange() {
    const { t } = useTranslation();
    const blockRef = useRef(true);
    useLeaveWarning(blockRef);
    const [config] = useAtom(configAtom);
    const [word, setWord] = useAtom(selectedTermAtom);
    const [model] = useAtom(modelAtom);
    const activeView = useAtomValue(activeViewAtom);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setWord(word || '');
    }, [setWord, word]);

    const doShowDialog = useCallback(() => {
        const params = new URLSearchParams(location.search);
        params.set('overlay', 'modelChange');
        navigate(`${location.pathname}?${params.toString()}`, { replace: false });
    }, [location, navigate]);

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
                    onAction={() => doShowDialog()}
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
