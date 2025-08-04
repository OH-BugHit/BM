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
import { Button, useID } from '@knicos/genai-base';
import { useTranslation } from 'react-i18next';
import { DatasetGallery } from '../DatasetGallery/DatasetGallery';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { close } from '../../components/Buttons/buttonStyles';
import MenuPanel from '../AppMenu/AppMenu';
import StartDialog from '../StartDialog/StartDialog';
import ModelDialog from '../ModelDialog/ModelDialog';
import { useModelNamesLoader } from '../../hooks/useModelNamesLoader';
import PointCard from './PointCard';
import UserGrid from '../UserGrid/UserGrid';
import TermChange from '../TermChange/TermChange';

export default function Teacher() {
    const blockRef = useRef(true);
    useLeaveWarning(blockRef);
    const { t } = useTranslation();
    const [config, setConfig] = useAtom(configAtom);
    const [termData, setTermData] = useAtom(termTransferAtom);
    const MYCODE = useID(5);
    const [studentData] = useAtom(studentDataAtom);
    const [users] = useAtom(usersAtom);
    const [model, setModel] = useAtom(modelAtom);
    const [openImage, setOpenImage] = useState<string | null>(null);
    const [allLabels, setAllLabels] = useState<string[]>([]);
    const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());
    const [labelChangeOpen] = useAtom(menuShowTermChangeAtom);
    const [categoryViewOpen] = useAtom(menuShowCategoryViewAtom);
    const [galleryOpen] = useAtom(menuShowTrainingDataAtom);
    const [usersOpen] = useAtom(menuShowUsersAtom);

    const toggleMenu = (key: string) => {
        setOpenKeys((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };

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
    const renderStudentImages = () => {
        if (!studentData?.students) return <div>Ei kuvia</div>;

        // Kerätään kaikki mahdolliset classnamet kaikilta opiskelijoilta
        const allClassnames = new Set<string>();
        for (const studentScores of studentData.students.values()) {
            for (const classname of studentScores.data.keys()) {
                allClassnames.add(classname);
            }
        }

        // Renderöidään jokainen termi
        return (
            <>
                {[...allClassnames].sort().map((classname) => {
                    // Kerätään kaikki studentit, joilla on tämä classname
                    const studentsWithTerm: {
                        studentId: string;
                        score: number;
                        topCanvas: HTMLCanvasElement | null;
                        topHeatmap: HTMLCanvasElement | null;
                    }[] = [];

                    for (const [studentId, studentScores] of studentData.students.entries()) {
                        const entry = studentScores.data.get(classname);
                        if (entry && typeof entry.score === 'number') {
                            studentsWithTerm.push({
                                studentId,
                                score: entry.score,
                                topCanvas: entry.topCanvas ?? null,
                                topHeatmap: entry.topHeatmap ?? null,
                            });
                        }
                    }

                    // Lajitellaan scorejen mukaan laskevasti
                    studentsWithTerm.sort((a, b) => b.score - a.score);

                    // Kaksi parasta esitellään scoreilla
                    const topTwo = studentsWithTerm.slice(0, 2);
                    const others = studentsWithTerm.slice(2);

                    return (
                        <div
                            className={style.termItem}
                            key={classname}
                        >
                            <h3>{classname}</h3>
                            <Button
                                variant="contained"
                                onClick={() => toggleMenu(classname)}
                                sx={{ minHeight: '60px', marginBottom: '1rem' }}
                            >
                                {openKeys.has(classname) ? t('common.hideInfo') : t('common.showInfo')}
                            </Button>
                            <div
                                className={
                                    openKeys.has(classname) ? style.termItemContainerOpen : style.termItemContainer
                                }
                            >
                                <div className={style.topStudentsContainer}>
                                    {topTwo.map((entry) => (
                                        <div
                                            key={entry.studentId}
                                            className={style.topStudentItem}
                                        >
                                            <PointCard
                                                place="top"
                                                entry={entry}
                                                setOpenImage={setOpenImage}
                                            />
                                        </div>
                                    ))}
                                </div>
                                {others.length > 0 && (
                                    <div className={style.topStudentsContainer}>
                                        <div style={{ display: 'flex', gap: 16 }}>
                                            {others.map((entry) => (
                                                <div
                                                    key={entry.studentId}
                                                    className={style.otherStudentItem}
                                                >
                                                    <PointCard
                                                        place="rest"
                                                        entry={entry}
                                                        setOpenImage={setOpenImage}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </>
        );
    };

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
                {usersOpen && studentData && <UserGrid />}
                {labelChangeOpen && <TermChange allLabels={allLabels} />}

                {categoryViewOpen && (
                    <div className={style.innerContainer}>
                        <div className={style.resultsContainer}>{renderStudentImages()}</div>
                    </div>
                )}
            </div>
            {openImage && (
                <div
                    className={style.openImageOverlay}
                    onClick={() => setOpenImage(null)}
                >
                    <div className={style.imageWrapper}>
                        <Button
                            onClick={() => setOpenImage(null)}
                            style={close}
                            title={t('common.close')}
                            aria-label="Sulje"
                        >
                            <CloseSharpIcon />
                        </Button>
                        <img
                            src={openImage}
                            alt="isompi kuva"
                            style={{ maxWidth: '90vw', maxHeight: '90vh', boxShadow: '0 0 24px #000' }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}
