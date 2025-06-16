import { useAtom } from 'jotai';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import { useLeaveWarning } from '../../hooks/leaveBlocker';
import ServerProtocol from '../../services/ServerProtocol';
import style from './style.module.css';
import { configAtom, modelAtom, studentDataAtom } from '../../atoms/state';
import { useEffect, useState } from 'react';
import { useID } from '@knicos/genai-base';
import { CanvasCopy } from '../../components/CanvasCopy/CanvasCopy';
import { PauseButton } from '../../components/Buttons/PauseButton';
import { loadModel } from '../../services/loadModel';
import { NativeSelect } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function Teacher() {
    useLeaveWarning(true);
    const { t } = useTranslation();
    const [, setConfig] = useAtom(configAtom);
    const [word, setWord] = useState('');
    const MYCODE = useID(5);
    const [studentData] = useAtom(studentDataAtom);
    const [model, setModel] = useAtom(modelAtom);
    const [pause, setPause] = useState(true);

    // Load model if needed
    useEffect(() => {
        if (!model) {
            loadModel().then((loadedModel) => {
                setModel(loadedModel);
            });
        }
        setWord(model?.getLabels()[0] || '');
        setConfig({ data: model?.getLabels()[0] || '', pause: true });
    }, [model, setModel, setConfig]);

    const handleChangeTerm = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newWord = event.target.value;
        setWord(newWord);
        setConfig({ data: newWord });
    };

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
                        <div
                            key={classname}
                            style={{ marginBottom: 32 }}
                        >
                            <h3>{classname}</h3>
                            <div style={{ display: 'flex', gap: 24 }}>
                                {topTwo.map((entry) => (
                                    <div
                                        key={entry.studentId}
                                        style={{ border: '1px solid #ccc', padding: 8 }}
                                    >
                                        <div>
                                            <b>ID:</b> {entry.studentId}
                                        </div>
                                        <div>
                                            <b>Score:</b> {entry.score}
                                        </div>
                                        {entry.topCanvas && (
                                            <div>
                                                <div>Paras kuva</div>
                                                <CanvasCopy sourceCanvas={entry.topCanvas} />
                                            </div>
                                        )}
                                        {entry.topHeatmap && (
                                            <div>
                                                <div>Heatmap</div>
                                                <CanvasCopy sourceCanvas={entry.topHeatmap} />
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
                                                    <div>
                                                        <CanvasCopy sourceCanvas={entry.topCanvas} />
                                                    </div>
                                                )}
                                                {entry.topHeatmap && (
                                                    <div>
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
            <div className={style.serverProtocolContainer}>
                <ServerProtocol code={MYCODE} />
            </div>
            <p>{`address: ${MYCODE}`}</p>
            <Header
                title={'Teacher'}
                block={true}
            />
            <div className={style.innerContainer}>
                <div className={style.studentControlContainer}>
                    <NativeSelect
                        value={word}
                        onChange={handleChangeTerm}
                        variant="outlined"
                        style={{ padding: '4px' }}
                        inputProps={{ 'aria-label': t('app.language', { ns: 'common' }) }}
                    >
                        {model?.getLabels().map((lbl) => (
                            <option
                                key={lbl}
                                value={lbl}
                            >
                                {lbl}
                            </option>
                        ))}
                    </NativeSelect>
                    <PauseButton
                        pause={pause}
                        setPause={setPause}
                        setConfig={setConfig}
                    />
                </div>
                <div className={style.topThreeContainer}>{renderStudentImages()}</div>
                <div className={style.otherResultsContainer}>all else</div>
            </div>
            <Footer />
        </div>
    );
}
