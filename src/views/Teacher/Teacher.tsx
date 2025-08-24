import { useAtom } from 'jotai';
import Footer from '../../components/Footer/Footer';
import { useLeaveWarning } from '../../hooks/useLeaveBlocker';
import ServerProtocol from '../../services/ServerProtocol';
import style from './style.module.css';
import {
    configAtom,
    menuShowTermChangeAtom,
    menuShowLeaderboardAtom,
    menuShowTrainingDataAtom,
    menuShowUserGridAtom,
    modelAtom,
    studentDataAtom,
    usersAtom,
    termTransferAtom,
} from '../../atoms/state';
import { useEffect, useRef, useState } from 'react';
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

export default function Teacher() {
    const blockRef = useRef(true);
    useLeaveWarning(blockRef);
    const [config, setConfig] = useAtom(configAtom);
    const [termData, setTermData] = useAtom(termTransferAtom);
    const MYCODE = useID(5);
    const [studentData] = useAtom(studentDataAtom);
    const [users] = useAtom(usersAtom);
    const [model, setModel] = useAtom(modelAtom);
    const [allLabels, setAllLabels] = useState<string[]>([]);
    const [labelChangeOpen] = useAtom(menuShowTermChangeAtom);
    const [scoreboardViewOpen] = useAtom(menuShowLeaderboardAtom);
    const [galleryOpen] = useAtom(menuShowTrainingDataAtom);
    const [usersOpen] = useAtom(menuShowUserGridAtom);

    // Load model if needed and set initial term, also pause the students
    useModelNamesLoader();
    useEffect(() => {
        if (model) {
            setAllLabels(model.getLabels());
        }
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
                    {galleryOpen && termData?.term && <DatasetGallery allLabels={allLabels} />}
                    {usersOpen && studentData && (
                        <>
                            <UserMenu />
                            <UserGrid />
                        </>
                    )}
                    {labelChangeOpen && (
                        <>
                            <TermMenu />
                            <TermChange allLabels={allLabels} />
                        </>
                    )}
                    {scoreboardViewOpen && <Scoreboard />}
                    <ControlMenu />
                </div>
                <Footer />
            </div>
        </Peer>
    );
}
