import { useAtom } from 'jotai';
import Footer from '../../components/Footer/Footer';
import { useLeaveWarning } from '../../hooks/leaveBlocker';
import ServerProtocol from '../../services/ServerProtocol';
import style from './style.module.css';
import { configAtom, modelAtom, studentDataAtom, usersAtom } from '../../atoms/state';
import { useEffect, useState } from 'react';
import { Button, useID } from '@knicos/genai-base';
import { CanvasCopy } from '../../components/CanvasCopy/CanvasCopy';
import { loadModel } from '../../services/loadModel';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useTranslation } from 'react-i18next';
import { DatasetGallery } from '../DatasetGallery/DatasetGallery';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { close } from '../../components/Buttons/buttonStyles';
import MenuPanel from '../AppMenu/AppMenu';
import StartDialog from '../StartDialog/StartDialog';

export default function Teacher() {
    useLeaveWarning(true);
    const { t } = useTranslation();
    const [config, setConfig] = useAtom(configAtom);
    const [word, setWord] = useState('');
    const MYCODE = useID(5);
    const [studentData] = useAtom(studentDataAtom);
    const [users] = useAtom(usersAtom);
    const [model, setModel] = useAtom(modelAtom);
    const [openImage, setOpenImage] = useState<string | null>(null);
    const [allLabels, setAllLabels] = useState<string[]>([]);

    // Load model if needed and set initial term, also pause the students
    useEffect(() => {
        if (!model) {
            loadModel().then((loadedModel) => {
                setModel(loadedModel);
                setAllLabels(loadedModel.getLabels());
            });
        } else {
            setAllLabels(model.getLabels());
        }
        setWord(model?.getLabels()[0] || '');
        setConfig({ data: model?.getLabels()[0] || '', pause: true, heatmap: false, gallery: false });
    }, [model, setModel, setConfig]);

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
            <div>
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

                    // Kaksi parasta
                    const topTwo = studentsWithTerm.slice(0, 2);
                    const others = studentsWithTerm.slice(2);

                    return (
                        <div key={classname}>
                            <h3>{classname}</h3>
                            <div className={style.topStudentsContainer}>
                                {topTwo.map((entry) => (
                                    <div
                                        key={entry.studentId}
                                        className={style.topStudentItem}
                                    >
                                        <div>
                                            <b>Name:</b> {entry.studentId}
                                        </div>
                                        <div>
                                            <b>Score:</b> {entry.score}
                                        </div>
                                        {entry.topCanvas && (
                                            <div
                                                onClick={() => {
                                                    const dataUrl = entry.topCanvas?.toDataURL();
                                                    if (dataUrl) setOpenImage(dataUrl);
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <h4>{t('scores.bestImage')}</h4>
                                                <CanvasCopy
                                                    sourceCanvas={entry.topCanvas}
                                                    maxWidth={200}
                                                />
                                            </div>
                                        )}
                                        {entry.topHeatmap && (
                                            <div>
                                                <div
                                                    onClick={() => {
                                                        const dataUrl = entry.topHeatmap?.toDataURL();
                                                        if (dataUrl) setOpenImage(dataUrl);
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <h4>Heatmap</h4>
                                                    <CanvasCopy
                                                        sourceCanvas={entry.topHeatmap}
                                                        maxWidth={200}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {others.length > 0 && (
                                <>
                                    <p>muut:</p>
                                    <div style={{ display: 'flex', gap: 16 }}>
                                        {others.map((entry) => (
                                            <div
                                                key={entry.studentId}
                                                style={{ border: '1px solid #eee', padding: 6 }}
                                            >
                                                <div>
                                                    <b>ID:</b> {entry.studentId}
                                                </div>
                                                {entry.topCanvas && (
                                                    <div
                                                        onClick={() => {
                                                            const dataUrl = entry.topCanvas?.toDataURL();
                                                            if (dataUrl) setOpenImage(dataUrl);
                                                        }}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <CanvasCopy sourceCanvas={entry.topCanvas} />
                                                    </div>
                                                )}
                                                {entry.topHeatmap && (
                                                    <div
                                                        onClick={() => {
                                                            const dataUrl = entry.topHeatmap?.toDataURL();
                                                            if (dataUrl) setOpenImage(dataUrl);
                                                        }}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <CanvasCopy sourceCanvas={entry.topHeatmap} />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    // Komennot lähetetään muokkaamalla config-atomia
    return (
        <div className={style.container}>
            <div className={style.galleryContainer}>{config?.data && <DatasetGallery allLabels={allLabels} />}</div>
            <div className={style.sideMenu}>
                <MenuPanel />
            </div>
            <StartDialog
                users={users}
                code={MYCODE}
            />
            <div className={style.serverProtocolContainer}>
                <ServerProtocol code={MYCODE} />
            </div>
            <div className={style.innerContainer}>
                {allLabels.length !== 0 && (
                    <div className={style.studentControlContainer}>
                        <Autocomplete
                            options={allLabels || []}
                            value={word}
                            style={{
                                padding: '4px',
                                margin: '1rem',
                                minWidth: '400px',
                                maxWidth: '600px',
                                width: '100%',
                            }}
                            onChange={(_, newValue) => {
                                setWord(newValue || '');
                                setConfig({
                                    data: newValue || '',
                                    pause: true,
                                    heatmap: config.heatmap,
                                    gallery: config.gallery,
                                });
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t('common.selectLabel')}
                                />
                            )}
                        />
                    </div>
                )}

                <div className={style.resultsContainer}>{renderStudentImages()}</div>
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
