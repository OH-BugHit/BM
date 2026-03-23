import style from './scoreRow.module.css';
import { useAtom, useSetAtom } from 'jotai';
import { isOutOfFocusAtom, studentDataAtom, teacherHidesAtom } from '../../../atoms/state';
import { Dispatch, SetStateAction } from 'react';
import { CanvasCopy } from '../../../components/CanvasCopy/CanvasCopy';
import { useTranslation } from 'react-i18next';

const PICSIZE = 140; // Was 80

interface Props {
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
 * @param student Student name
 * @param setOpenImage For opening image to preview
 * @returns View of all the top pictures from single student
 */
export default function AllStudentPics({ student, setOpenImage }: Props) {
    const { t } = useTranslation();
    const [studentData] = useAtom(studentDataAtom);
    const [hiddenByTeacher] = useAtom(teacherHidesAtom);
    const setIsOutOfFocus = useSetAtom(isOutOfFocusAtom);

    const studentEntry = studentData.students.get(student);

    const pics = Array.from(studentEntry?.data.entries() || [])
        .filter(([className, entry]) => !entry.hidden && !hiddenByTeacher.get(student)?.includes(className))
        .map(([, entry]) => entry.topCanvas);
    return (
        <div
            className={style.viewPhotoButton}
            role="list"
        >
            {pics.map((pic, idx) => (
                <button
                    title={t('scoreboard.actions.open.image')}
                    className={style.image}
                    key={idx}
                    onClick={() => {
                        {
                            if (pic) {
                                setIsOutOfFocus(true);
                                setOpenImage(pic);
                            }
                        }
                    }}
                    style={{
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none',
                        paddingInline: '0',
                    }}
                    role="listitem"
                >
                    <CanvasCopy
                        sourceCanvas={pic}
                        maxWidth={PICSIZE}
                        width={PICSIZE}
                        height={PICSIZE}
                    />
                </button>
            ))}
        </div>
    );
}
