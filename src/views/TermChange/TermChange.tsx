import { useAtom } from 'jotai';
import { useLeaveWarning } from '../../hooks/useLeaveBlocker';
import style from './style.module.css';
import { configAtom, modelAtom, selectedTermAtom } from '../../atoms/state';
import { useEffect, useRef } from 'react';
import TermSelector from './TermSelector';
import { useTranslation } from 'react-i18next';
import UserList from './UserList';

export default function TermChange() {
    const { t } = useTranslation();
    const blockRef = useRef(true);
    useLeaveWarning(blockRef);
    const [config] = useAtom(configAtom);
    const [word, setWord] = useAtom(selectedTermAtom);
    const [model] = useAtom(modelAtom);

    useEffect(() => {
        setWord(word || '');
    }, [setWord, word]);

    return (
        <>
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
            </div>
        </>
    );
}
