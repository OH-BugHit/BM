import { useAtom } from 'jotai';
import Footer from '../../components/Footer/Footer';
import { useLeaveWarning } from '../../hooks/useLeaveBlocker';
import ServerProtocol from '../../services/ServerProtocol';
import style from './style.module.css';
import { configAtom, modelAtom, studentDataAtom, usersAtom, termTransferAtom, activeViewAtom } from '../../atoms/state';
import { useEffect, useRef } from 'react';
import { useID } from '@genai-fi/base';
import { DatasetGallery } from '../DatasetGallery/DatasetGallery';
import MenuPanel from '../AppMenu/AppMenu';
import StartDialog from '../StartDialog/StartDialog';
import ModelDialog from '../ModelDialog/ModelDialog';
import { useModelNamesLoader } from '../../hooks/useModelNamesLoader';
import UserGrid from '../UserGrid/UserGrid';
import TermChange from '../TermChange/TermChange';
import UserMenu from '../UserMenu/UserMenu';
import TermMenu from '../TermMenu/TermMenu';
import Scoreboard from '../Scoreboard/Scoreboard';
import Settings from '../Settings/Settings';
import { Peer } from '@genai-fi/base/hooks/peer';
import PeerEnv from '../../env';
import ControlMenu from '../ControlMenu/UserMenu';
import { useRestoreGameState } from '../../hooks/useRestoreGameStateHook';
import { usePersistGameState } from '../../hooks/usePersistGameState';

export default function Teacher() {
    const blockRef = useRef(true);
    useLeaveWarning(blockRef);
    const [config, setConfig] = useAtom(configAtom);
    const [, setTermData] = useAtom(termTransferAtom);
    const MYCODE = useID(5);
    const [studentData] = useAtom(studentDataAtom);
    const [users] = useAtom(usersAtom);
    const [model, setModel] = useAtom(modelAtom);
    const [activeView] = useAtom(activeViewAtom);
    // Load model if needed and set initial term, also pause the students
    useModelNamesLoader();
    useRestoreGameState();
    usePersistGameState();

    useEffect(() => {
        setConfig((old) => ({
            ...old,
            pause: true,
            heatmap: false,
            gallery: false,
        }));
        setTermData({ term: model?.getLabels()[0] || '', recipient: { username: 'a' } });
    }, [model, setModel, setConfig, config.modelData, setTermData]);

    return (
        <Peer
            host={PeerEnv.host}
            secure={PeerEnv.secure}
            peerkey={PeerEnv.peerkey}
            port={PeerEnv.port}
            code={`spoof-${MYCODE}`}
        >
            <div className={style.teacher}>
                <div className={style.serverProtocolContainer}>
                    <ServerProtocol />
                </div>
                <StartDialog
                    users={users}
                    code={MYCODE}
                />
                <Settings />
                <ModelDialog />
                <div className={style.sideMenuContainer}>
                    <MenuPanel />
                </div>
                <div className={style.content}>
                    {activeView.overlay === 'trainingData' && <DatasetGallery />}
                    {activeView.active === 'userGrid' && studentData && (
                        <>
                            <UserMenu />
                            <UserGrid />
                        </>
                    )}
                    {activeView.active === 'termChange' && (
                        <>
                            <TermMenu />
                            <TermChange />
                        </>
                    )}
                    {activeView.active === 'default' && <Scoreboard />}
                    <ControlMenu />
                </div>
                <Footer />
            </div>
        </Peer>
    );
}
