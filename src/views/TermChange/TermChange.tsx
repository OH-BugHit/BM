import { useAtom } from 'jotai';
import { useLeaveWarning } from '../../hooks/useLeaveBlocker';
import style from './style.module.css';
import { configAtom, selectedTermAtom, selectedUserAtom, showUserTermDialogAtom } from '../../atoms/state';
import { useEffect, useRef } from 'react';
import UserGrid from '../UserGrid/UserGrid';
import UserTermDialog from '../UserTermDialog/UserTermDialog';
import TermSelector from '../../components/TermSelector/TermSelector';

export default function TermChange({ allLabels }: { allLabels: string[] }) {
    const blockRef = useRef(true);
    useLeaveWarning(blockRef);
    const [config] = useAtom(configAtom);
    const [, setShowDialog] = useAtom(showUserTermDialogAtom);
    const [word, setWord] = useAtom(selectedTermAtom);
    const [selectedUser] = useAtom(selectedUserAtom);

    useEffect(() => {
        setWord(word || '');
    }, [setWord, word]);

    useEffect(() => {
        if (selectedUser.username.length > 0) {
            setShowDialog(true);
        }
    }, [selectedUser, setShowDialog]);
    return (
        <>
            <UserTermDialog allLabels={allLabels} />
            <div className={style.selectorContainer}>
                <div className={style.modeContainer}>
                    {config.gameMode === 'all' && (
                        <div className={style.modeItem}>
                            <div className={style.collapsibleContent}>
                                <h3>Vaihda sana kaikille</h3>
                                {allLabels.length !== 0 && (
                                    <div className={style.selectorItem}>
                                        <TermSelector allLabels={allLabels} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {config.gameMode === 'single' && (
                        <div className={style.modeItem}>
                            <h3>Vaihda yksittäisen käyttäjän sana</h3>
                            <div className={style.collapsibleContent}>
                                <UserGrid />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
