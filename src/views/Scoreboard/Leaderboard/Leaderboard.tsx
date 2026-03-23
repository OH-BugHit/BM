import style from './leaderboard.module.css';
import { isOutOfFocusAtom, profilePicturesAtom, studentDataAtom } from '../../../atoms/state';
import { useAtom, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import ImageView from '../../../components/ImageView/ImageView';
import ScoreRow from '../ScoreRow/Scorerow';
import { generateScores } from './generateScores';
import VisibilityToggle from './ResultsVisToggle';

interface Props {
    className: string | null;
}

export default function Leaderboard({ className }: Props) {
    const { t } = useTranslation();
    const [studentData] = useAtom(studentDataAtom);
    const [profilePics] = useAtom(profilePicturesAtom);
    const setIsOutOfFocus = useSetAtom(isOutOfFocusAtom);

    const [openImage, setOpenImage] = useState<
        { student: string; className: string } | null | HTMLCanvasElement | undefined
    >(null);

    const scores = generateScores(studentData, profilePics, className);

    useEffect(() => {
        if (openImage) {
            setIsOutOfFocus(true);
        } else {
            setIsOutOfFocus(undefined);
        }
    }, [openImage, setIsOutOfFocus]);

    return (
        <>
            <div
                className={style.leaderboard}
                inert={openImage ? true : undefined}
                role="list"
            >
                <div className={style.hidePictures}>
                    <VisibilityToggle />
                </div>
                <h1>{t('scoreboard.labels.standings')}</h1>

                <AnimatePresence>
                    {scores.map((student, index) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            key={student.studentId}
                            className={style.leaderboardItem}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            role="listitem"
                        >
                            <ScoreRow
                                index={index}
                                student={student}
                                term={className}
                                setOpenImage={setOpenImage}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            {openImage && (
                <ImageView
                    openImage={openImage}
                    setOpenImage={setOpenImage}
                />
            )}
        </>
    );
}
