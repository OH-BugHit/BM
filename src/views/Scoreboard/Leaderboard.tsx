import { profilePicturesAtom, studentDataAtom } from '../../atoms/state';
import { useAtom } from 'jotai';
import style from './leaderboard.module.css';
import { CanvasCopy } from '../../components/CanvasCopy/CanvasCopy';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import { useEffect, useState } from 'react';
import { Button } from '@knicos/genai-base';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { useTranslation } from 'react-i18next';
import { close } from '../../components/Buttons/buttonStyles';
import { motion } from 'framer-motion';

interface Props {
    className: string | null;
}

export default function Leaderboard({ className }: Props) {
    const { t } = useTranslation();
    const VISIBLE_SCORE_INDEX = 2;

    const [studentData] = useAtom(studentDataAtom);
    const [profilePics] = useAtom(profilePicturesAtom);
    const [maxSize, setMaxSize] = useState(Math.min(window.innerWidth * 0.2, window.innerHeight * 0.4));

    const [openImage, setOpenImage] = useState<{ student: string; className: string } | null>({
        student: '',
        className: '',
    });

    useEffect(() => {
        const handleResize = () => setMaxSize(Math.min(window.innerWidth * 0.2, window.innerHeight * 0.4));

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                        {className !== null && (
                            <div
                                className={style.viewPhotoButton}
                                onClick={() => {
                                    setOpenImage({ student: student.studentId, className: className });
                                }}
                            >
                                {t('scoreboard.labels.resultPictures')}
                                <WallpaperIcon fontSize="large" />
                            </div>
                        )}
                        <div className={style.score}>
                            {index <= VISIBLE_SCORE_INDEX && (
                                <div className={style.infoData}>{student.totalScore.toFixed(2)}</div>
                            )}
                            {index > VISIBLE_SCORE_INDEX && <div className={style.infoData}>???</div>}
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
