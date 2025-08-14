import { profilePicturesAtom, settingAtom, studentDataAtom } from '../../atoms/state';
import { useAtom } from 'jotai';
import style from './leaderboard.module.css';
import { CanvasCopy } from '../../components/CanvasCopy/CanvasCopy';
import { useEffect, useState } from 'react';
import { Button } from '@genai-fi/base';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import BlockIcon from '@mui/icons-material/Block';
import { useTranslation } from 'react-i18next';
import { close } from '../../components/Buttons/buttonStyles';
import { motion } from 'framer-motion';

interface Props {
    className: string | null;
}

export default function Leaderboard({ className }: Props) {
    const { t } = useTranslation();

    const [studentData] = useAtom(studentDataAtom);
    const [profilePics] = useAtom(profilePicturesAtom);
    const [maxSize, setMaxSize] = useState(Math.min(window.innerWidth * 0.2, window.innerHeight * 0.4));
    const [settings] = useAtom(settingAtom);
    const [hiddenByTeacher, setHiddenByTeacher] = useState<Map<string, string[]>>(new Map());

    const [openImage, setOpenImage] = useState<{ student: string; className: string } | null>({
        student: '',
        className: '',
    });

    useEffect(() => {
        const handleResize = () => setMaxSize(Math.min(window.innerWidth * 0.2, window.innerHeight * 0.4));

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const allStudentPics = ({ student }: { student: string }) => {
        const studentEntry = studentData.students.get(student);
        const pics = Array.from(studentEntry?.data.values() || [])
            .filter((entry) => !entry.hidden)
            .map((entry) => entry.topCanvas);
        return (
            <div className={style.viewPhotoButton}>
                {pics.map((pic, idx) => (
                    <div
                        className={style.image}
                        key={idx}
                    >
                        <CanvasCopy
                            sourceCanvas={pic}
                            maxWidth={64}
                            width={64}
                            height={64}
                            shape="squircle"
                        />
                    </div>
                ))}
            </div>
        );
    };

    const showClassImage = ({ className, student }: { className: string; student: string }) => {
        const studentEntry = studentData.students.get(student);

        if (!studentEntry) {
            return;
        }

        const classEntry = studentEntry.data.get(className);
        if (!classEntry) {
            return;
        }

        return (
            <>
                {!classEntry.hidden && !hiddenByTeacher.get(student)?.includes(className) && (
                    <div
                        className={style.viewPhotoButton}
                        onClick={() => {
                            setOpenImage({ student: student, className: className });
                        }}
                    >
                        <CanvasCopy
                            sourceCanvas={classEntry.topCanvas}
                            maxWidth={80}
                            width={80}
                            height={80}
                        />
                    </div>
                )}
                {studentEntry.data.get(className)?.hidden && (
                    <div className={style.hiddenByStudent}>
                        <BlockIcon fontSize="large" />
                    </div>
                )}
                {!hiddenByTeacher.get(student)?.includes(className) && (
                    <div
                        className={style.visButton}
                        onClick={() => {
                            setHiddenByTeacher((prev) => {
                                const newMap = new Map(prev);
                                const hiddenClasses = newMap.get(student) ?? [];
                                newMap.set(student, [...hiddenClasses, className]);
                                return newMap;
                            });
                        }}
                    >
                        <VisibilityIcon fontSize="large" />
                    </div>
                )}
                {hiddenByTeacher.get(student)?.includes(className) && (
                    <div
                        className={style.visButton}
                        onClick={() => {
                            setHiddenByTeacher((prev) => {
                                const newMap = new Map(prev);
                                const hiddenClasses = newMap.get(student) ?? [];
                                newMap.set(
                                    student,
                                    [...hiddenClasses].filter((c) => c !== className)
                                );
                                return newMap;
                            });
                        }}
                    >
                        <VisibilityOffIcon fontSize="large" />
                    </div>
                )}
            </>
        );
    };
    const scores: {
        totalScore: number;
        studentId: string;
        studentPic: HTMLCanvasElement | undefined;
    }[] = [];

    for (const [studentId, studentScores] of studentData.students.entries()) {
        // Go trough all students and their scores
        let studentScore = 0;
        if (className === null) {
            for (const [, score] of studentScores.data.entries()) {
                // Go trough all terms that student has done and add all scores together
                studentScore += score.score ? score.score : 0;
            }
        } else {
            const entry = studentScores.data.get(className ? className : '');
            studentScore = entry?.score ? entry.score : 0;
        }
        scores.push({
            studentId,
            totalScore: studentScore,
            studentPic: profilePics.get(studentId),
        });
    }

    scores.sort((a, b) => b.totalScore - a.totalScore);

    return (
        <div className={style.leaderboard}>
            <h1>{t('scoreboard.labels.standings')}</h1>
            {scores.map((student, index) => (
                <motion.div
                    layout
                    key={student.studentId}
                    className={style.leaderboardItem}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                    <div className={style.leaderboardPlace}>
                        <div className={style.infoData}>{index + 1}</div>
                    </div>
                    <div className={style.scoreRow}>
                        <div className={style.studentInfo}>
                            <div className={style.avatarWrapper}>
                                {index === 0 && (
                                    <img
                                        src="/aiKruunuSmall.png"
                                        className={style.crownImg}
                                        height="60"
                                    />
                                )}
                                {student.studentPic && (
                                    <CanvasCopy
                                        sourceCanvas={student.studentPic}
                                        maxWidth={100}
                                        shape="leftRound"
                                    />
                                )}
                            </div>
                            <div className={style.infoData}>{student.studentId}</div>
                        </div>
                        <div style={{ flexGrow: 1 }} />
                        {!settings.teacherHideResultPicture && className !== null && (
                            <>{showClassImage({ className: className, student: student.studentId })}</>
                        )}
                        {!settings.teacherHideResultPicture && className === null && (
                            <>
                                <div className={style.allPics}>{allStudentPics({ student: student.studentId })}</div>
                            </>
                        )}
                        <div className={style.score}>
                            {(settings.limitScoreboard.showAll || index < settings.limitScoreboard.limit) && (
                                <div className={style.infoData}>{student.totalScore.toFixed(2)}</div>
                            )}
                            {!settings.limitScoreboard.showAll && index >= settings.limitScoreboard.limit && (
                                <div className={style.infoData}>???</div>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
            {openImage?.className && (
                <div
                    className={style.openImageOverlay}
                    onClick={() => setOpenImage(null)}
                >
                    <div className={style.topPictureContainer}>
                        <Button
                            onClick={() => setOpenImage(null)}
                            style={close}
                            title={t('common.close')}
                            aria-label="Sulje"
                        >
                            <CloseSharpIcon />
                        </Button>
                        <CanvasCopy
                            sourceCanvas={
                                studentData.students.get(openImage.student)?.data.get(openImage.className)?.topCanvas
                            }
                            maxWidth={maxSize}
                            width={maxSize}
                            height={maxSize}
                        />
                        <CanvasCopy
                            sourceCanvas={
                                studentData.students.get(openImage.student)?.data.get(openImage.className)?.topHeatmap
                            }
                            maxWidth={maxSize}
                            width={maxSize}
                            height={maxSize}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
