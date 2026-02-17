import Footer from '../../components/Footer/Footer';
import { useLeaveWarning } from '../../hooks/useLeaveBlocker';
import ServerProtocol from '../../services/ServerProtocol';
import style from './style.module.css';
import { useRef } from 'react';
import StartDialog from '../StartDialog/StartDialog';
import ModelDialog from '../ModelDialog/ModelDialog';
import { useModelNamesLoader } from '../../hooks/useModelNamesLoader';
import Settings from '../Settings/Settings';
import { Peer } from '@genai-fi/base/hooks/peer';
import PeerEnv from '../../env';
import { useRestoreGameState } from '../../hooks/useRestoreGameStateHook';
import { usePersistGameState } from '../../hooks/usePersistGameState';
import TeacherContent from './TeacherContent';
import SideNavSwitcher from './SideMenu/SideMenuSwitcher';
import ViewHandler from '../../components/ViewHandler';
import ShareProtocol from '../../services/ShareProtocol';
import ModelChangeHandler from '../../components/ModelChangeHandler';

export default function Teacher({ ID }: { ID: string }) {
    const blockRef = useRef(true);
    useLeaveWarning(blockRef);
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
            code={`spoof-${ID}`}
        >
            <ShareProtocol />
            <ModelChangeHandler />
            <ViewHandler />
            <div className={style.teacher}>
                <div className={style.serverProtocolContainer}>
                    <ServerProtocol />
                </div>
                <StartDialog code={ID} />
                <Settings />
                <ModelDialog />
                <SideNavSwitcher />
                <TeacherContent />
                <Footer hideLang={false} />
            </div>
        </Peer>
    );
}
