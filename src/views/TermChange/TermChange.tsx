import { useAtom } from 'jotai';
import { useLeaveWarning } from '../../hooks/useLeaveBlocker';
import style from './style.module.css';
import { configAtom, selectedTermAtom, selectedUserAtom, showUserTermDialogAtom } from '../../atoms/state';
import { useEffect, useRef, useState } from 'react';
import UserGrid from '../UserGrid/UserGrid';
import UserTermDialog from '../UserTermDialog/UserTermDialog';
import TermSelector from '../../components/TermSelector/TermSelector';

export default function TermChange({ allLabels }: { allLabels: string[] }) {
    const blockRef = useRef(true);
    useLeaveWarning(blockRef);
    const [config, setConfig] = useAtom(configAtom);
    const [, setShowDialog] = useAtom(showUserTermDialogAtom);
    const [word, setWord] = useAtom(selectedTermAtom);
    const [modeSelection, setModeSelection] = useState<number>(0);
    const [selectedUser] = useAtom(selectedUserAtom);

    const toggleGameMode = (mode: number) => {
        if ((config.gameMode === 'single' && mode === 1) || (config.gameMode === 'all' && mode === 2)) {
            switch (mode) {
                case 1: {
                    setConfig((old) => ({
                        ...old,
                        gameMode: 'all',
                    }));
                    break;
                }
                case 2: {
                    setConfig((old) => ({
                        ...old,
                        gameMode: 'single',
                    }));
                    break;
                }
            }
        }
        setModeSelection((prev) => (prev === mode ? 0 : mode));
    };

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
                    <div
                        className={`${style.modeItem} ${config.gameMode === 'all' ? style.selected : ''}`}
                        onClick={() => toggleGameMode(1)}
                    >
                        <div className={modeSelection === 1 ? style.initialClosed : style.initialOpen}>
                            <img
                                src="/logo192_bw.png"
                                alt="logo"
                                width={160}
                                height={160}
                            />
                            <h2>Kaikille</h2> {/*TODO: Hardcoded Text*/}
                        </div>
                        <div
                            className={`${style.collapsibleContent} ${
                                modeSelection === 1 ? style.expanded : style.collapsed
                            } `}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3>Vaihda sana kaikille</h3>
                            {allLabels.length !== 0 && (
                                <div className={style.selectorItem}>
                                    <TermSelector allLabels={allLabels} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div
                        className={`${style.modeItem} ${config.gameMode === 'single' ? style.selected : ''}`}
                        onClick={() => toggleGameMode(2)}
                    >
                        <div className={modeSelection === 2 ? style.initialClosed : style.initialOpen}>
                            <img
                                src="/logo192_bw.png"
                                alt="logo"
                                width={160}
                                height={160}
                            />
                            <h2>Yksittäinen</h2> {/*TODO: Hardcoded Text*/}
                        </div>
                        <div
                            className={`${style.collapsibleContent} ${
                                modeSelection === 2 ? style.expanded : style.collapsed
                            }`}
                        >
                            <UserGrid />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
