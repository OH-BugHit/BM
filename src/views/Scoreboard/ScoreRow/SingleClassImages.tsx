import style from './scoreRow.module.css';
import { useAtom } from 'jotai';
import { studentDataAtom, teacherHidesAtom } from '../../../atoms/state';
import { CanvasCopy } from '../../../components/CanvasCopy/CanvasCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    term: string;
    student: string;
    setOpenImage: Dispatch<
        SetStateAction<
            | HTMLCanvasElement
            | {
                  student: string;
                  className: string;
              }
            | null
            | undefined
        >
    >;
}

/**
 *
 * @param className Classifying term selected
 * @param student Student's name
 * @param setOpenImage For opening image to preview
 * @returns View containing image of selected student's top pic on selected term
 */
export default function SingleClassImage({ term, student, setOpenImage }: Props) {
    const { t } = useTranslation();
    const [hiddenByTeacher, setHiddenByTeacher] = useAtom(teacherHidesAtom);
    const [studentData] = useAtom(studentDataAtom);

    const studentEntry = studentData.students.get(student);

    if (!studentEntry) {
        return;
    }

    const classEntry = studentEntry.data.get(term);
    if (!classEntry) {
        return;
    }

    return (
        <>
            <div className={style.visWrapper}>
                {!classEntry.hidden && !hiddenByTeacher.get(student)?.includes(term) && (
                    <button
                        title={t('scoreboard.actions.open.image')}
                        className={style.viewPhotoButton}
                        onClick={() => {
                            setOpenImage({ student: student, className: term });
                        }}
                        style={{
                            cursor: 'pointer',
                            border: 'none',
                            background: 'none',
                        }}
                    >
                        <CanvasCopy
                            sourceCanvas={classEntry.topCanvas}
                            maxWidth={80}
                            width={80}
                            height={80}
                        />
                    </button>
                )}
                {!classEntry.hidden && hiddenByTeacher.get(student)?.includes(term) && (
                    <div className={style.viewPhotoButton}>
                        <CanvasCopy
                            sourceCanvas={null}
                            maxWidth={80}
                            width={80}
                            height={80}
                            noBorder={true}
                        />
                    </div>
                )}
                {/*if student has blocked the image*/}
                {studentEntry.data.get(term)?.hidden && (
                    <em style={{ marginRight: '2rem' }}>{t('scoreboard.labels.hidden')}</em>
                )}

                {!classEntry.hidden && !hiddenByTeacher.get(student)?.includes(term) && (
                    <div
                        className={style.visButton}
                        onClick={() => {
                            setHiddenByTeacher((prev) => {
                                const newMap = new Map(prev);
                                const hiddenClasses = newMap.get(student) ?? [];
                                newMap.set(student, [...hiddenClasses, term]);
                                return newMap;
                            });
                        }}
                    >
                        <VisibilityIcon
                            fontSize="large"
                            color="action"
                        />
                    </div>
                )}
                {!classEntry.hidden && hiddenByTeacher.get(student)?.includes(term) && (
                    <div
                        className={style.visButton}
                        onClick={() => {
                            setHiddenByTeacher((prev) => {
                                const newMap = new Map(prev);
                                const hiddenClasses = newMap.get(student) ?? [];
                                newMap.set(
                                    student,
                                    [...hiddenClasses].filter((c) => c !== term)
                                );
                                return newMap;
                            });
                        }}
                    >
                        <VisibilityOffIcon
                            fontSize="large"
                            color="action"
                        />
                    </div>
                )}
            </div>
        </>
    );
}
