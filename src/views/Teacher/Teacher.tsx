import { useAtom } from 'jotai';
import Footer from '../../components/Footer/Footer';
import { useLeaveWarning } from '../../hooks/useLeaveBlocker';
import ServerProtocol from '../../services/ServerProtocol';
import style from './style.module.css';
import {
    configAtom,
    menuShowTermChangeAtom,
    menuShowCategoryViewAtom,
    menuShowTrainingDataAtom,
    menuShowUsersAtom,
    modelAtom,
    studentDataAtom,
    usersAtom,
    termTransferAtom,
} from '../../atoms/state';
import { useEffect, useRef, useState } from 'react';
import { useID } from '@knicos/genai-base';
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
    const [categoryViewOpen] = useAtom(menuShowCategoryViewAtom);
    const [galleryOpen] = useAtom(menuShowTrainingDataAtom);
    const [usersOpen] = useAtom(menuShowUsersAtom);

    // Load model if needed and set initial term, also pause the students
    useModelNamesLoader();
    useEffect(() => {
        if (model) {
            setAllLabels(model.getLabels());
        }
        setConfig((old) => ({
            pause: true,
            heatmap: false,
            gallery: false,
            modelData: old.modelData,
            gameMode: old.gameMode,
        }));
        setTermData({ term: model?.getLabels()[0] || '', recipient: { username: 'a' } });
    }, [model, setModel, setConfig, config.modelData, setTermData]);

    // Renderöi opiskelijoiden kuvat

    // Komennot lähetetään muokkaamalla config-atomia
    return (
        <div className={style.container}>
            <div className={style.serverProtocolContainer}>
                <ServerProtocol code={MYCODE} />
            </div>
            <StartDialog
                users={users}
                code={MYCODE}
            />
            <ModelDialog />
            <div className={style.sideMenu}>
                <MenuPanel />
            </div>
            <div className={style.content}>
                {galleryOpen && termData?.term && <DatasetGallery allLabels={allLabels} />}
                {usersOpen && studentData && (
                    <>
                        <UserMenu />
                        <div style={{ paddingTop: '6rem' }} />
                        <UserGrid />
                    </>
                )}
                {labelChangeOpen && (
                    <>
                        <TermMenu />
                        <div style={{ paddingTop: '6rem' }} />
                        <TermChange allLabels={allLabels} />
                    </>
                )}
                {categoryViewOpen && <Scoreboard />}
            </div>
            <Footer />
        </div>
    );
}
