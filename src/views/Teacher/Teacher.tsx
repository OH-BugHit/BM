import { useAtom } from 'jotai';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import { useLeaveWarning } from '../../hooks/leaveBlocker';
import ServerProtocol from '../../services/ServerProtocol';
import style from './style.module.css';
import { configAtom, studentDataAtom } from '../../atoms/state';
import { useState } from 'react';
import { Button, useID } from '@knicos/genai-base';
import { CanvasCopy } from '../../components/CanvasCopy/CanvasCopy';

export default function Teacher() {
    useLeaveWarning(true);
    const [, setConfig] = useAtom(configAtom);
    const [word, setWord] = useState('');
    const MYCODE = useID(5);
    const [studentData] = useAtom(studentDataAtom);

    const handleChangeConfig = () => {
        console.log('Lähetetään sana: ', word);
        setConfig({ data: word });
    };
    // Renderöi opiskelijoiden kuvat
    const renderStudentImages = () => {
        if (!studentData?.students) return <div>Ei kuvia A</div>;
        // Oletetaan vain yksi opiskelija (id: student1)
        const student = studentData.students.get('student1');
        if (!student) return <div>Ei kuvia B</div>;

        // classnamet aakkosjärjestykseen
        const sortedClassnames = Array.from(student.data.keys()).sort();

        return (
            <div>
                {sortedClassnames.map((classname) => {
                    const entry = student.data.get(classname);
                    if (!entry) return null;
                    return (
                        <div
                            key={classname}
                            style={{ marginBottom: 24 }}
                        >
                            <h4>{classname}</h4>
                            <div style={{ display: 'flex', gap: 16 }}>
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
                        </div>
                    );
                })}
            </div>
        );
    };

    // Komennot lähetetään muokkaamalla config-atomia
    return (
        <div className={style.container}>
            <ServerProtocol code={MYCODE} />
            <p>{`address: ${MYCODE}`}</p>
            <Header
                title={'Teacher'}
                block={true}
            />
            <Button
                sx={{ fontSize: '14pt', minWidth: '40px', marginTop: '6px' }}
                variant="contained"
                onClick={() => {
                    handleChangeConfig();
                }}
            >
                Lähetä testiä
            </Button>
            <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
            />
            <div className={style.innerContainer}>
                <div className={style.studentControlContainer}>
                    Contains controller for app and controlling the word if only one etc...
                </div>
                <div className={style.topThreeContainer}>{renderStudentImages()}</div>
                <div className={style.otherResultsContainer}>all else</div>
            </div>
            <Footer />
        </div>
    );
}
