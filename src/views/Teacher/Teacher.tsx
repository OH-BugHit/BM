import Footer from '../../components/Footer/Footer';
import { useLeaveWarning } from '../../hooks/useLeaveBlocker';
import ServerProtocol from '../../services/ServerProtocol';
import style from './style.module.css';
import { useRef } from 'react';
import { useID } from '@genai-fi/base';
import MenuPanel from '../AppMenu/AppMenu';
import StartDialog from '../StartDialog/StartDialog';
import ModelDialog from '../ModelDialog/ModelDialog';
import { useModelNamesLoader } from '../../hooks/useModelNamesLoader';
import Settings from '../Settings/Settings';
import { Peer } from '@genai-fi/base/hooks/peer';
import PeerEnv from '../../env';
import { useRestoreGameState } from '../../hooks/useRestoreGameStateHook';
import { usePersistGameState } from '../../hooks/usePersistGameState';
import TeacherContent from './TeacherContent';

export default function Teacher() {
    console.log(`Teacher-module rerendered`);
    const blockRef = useRef(true);
    useLeaveWarning(blockRef);
    const MYCODE = useID(5);
    // Load model if needed and set initial term, also pause the students
    useModelNamesLoader();
    useRestoreGameState();
    usePersistGameState();

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
                <StartDialog code={MYCODE} />
                <Settings />
                <ModelDialog />
                <div className={style.sideMenuContainer}>
                    <MenuPanel />
                </div>
                <TeacherContent />
                <Footer />
            </div>
        </Peer>
    );
}
