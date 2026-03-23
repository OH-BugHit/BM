import { useAtom, useAtomValue } from 'jotai';
import { useLeaveWarning } from '../../hooks/useLeaveBlocker';
import style from './style.module.css';
import { activeViewAtom, configAtom, currentCommonChallengeAtom, labelsAtom, modelAtom } from '../../atoms/state';
import { useCallback, useRef } from 'react';
import TermSelector from './TermSelector';
import { useTranslation } from 'react-i18next';
import UserList from './UserList';
import ActionButton from '../Guidance/ActionButton';
import { useLocation, useNavigate } from 'react-router';
import TermMenu from './TermMenu/TermMenu';

export default function TermChange() {
    const { t } = useTranslation();
    const blockRef = useRef(true);
    useLeaveWarning(blockRef);
    const [config] = useAtom(configAtom);
    const word = useAtomValue(currentCommonChallengeAtom);
    const [model] = useAtom(modelAtom);
    const activeView = useAtomValue(activeViewAtom);
    const navigate = useNavigate();
    const location = useLocation();
    const labels = useAtomValue(labelsAtom);

    const doShowDialog = useCallback(() => {
        const params = new URLSearchParams(location.search);
        params.set('overlay', 'modelChange');
        navigate(`${location.pathname}?${params.toString()}`, { replace: false });
    }, [location, navigate]);

    return (
        <div className={style.termChange}>
            <TermMenu />
            <div className={style.modeContainer}>
                {config.gameMode === 'all' && (
                    <div className={style.modeItem}>
                        <h1>{t('termSelect.titles.changeChallenge')}</h1>
                        <p>
                            {word
                                ? `${t('termSelect.titles.current')} ${labels?.labels?.get(word) ?? word}`
                                : `${t('termSelect.titles.noChallenge')}`}
                        </p>
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
                    tooltipTitle={t('teacher.labels.changeModel')}
                >
                    {t('teacher.labels.changeModel')}
                </ActionButton>
            </div>
            <div></div> {/*purpose of this is to be spacer*/}
        </div>
    );
}
