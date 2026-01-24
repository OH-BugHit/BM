import { IconButton } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import { useTranslation } from 'react-i18next';
import { UserItemData } from '../../utils/types';
import FloatingMenuItem from '../../components/FloatingMenu/FloatingMenuItem';
import { useAtomValue, useSetAtom } from 'jotai';
import {
    currentCommonChallengeAtom,
    labelsAtom,
    messageTransferAtom,
    studentDataAtom,
    topScoresAtom,
} from '../../atoms/state';
import { useAtomCallback } from 'jotai/utils';
import { updateTopScores } from '../../utils/updateTopScores';

interface Props {
    selectedUser: UserItemData;
}
export default function ResetScore({ selectedUser }: Props) {
    const { t } = useTranslation();
    const labelsValue = useAtomValue(labelsAtom);
    const currentLabel = useAtomValue(currentCommonChallengeAtom);
    const setMessage = useSetAtom(messageTransferAtom);
    const setTopScores = useSetAtom(topScoresAtom);

    const resetScore = useAtomCallback((get, set, username: string) => {
        const topScores = get(topScoresAtom);
        const forLabel = topScores.scores.get(currentLabel);
        if (
            forLabel?.thirdScore?.studentId === username ||
            forLabel?.secondScore?.studentId === username ||
            forLabel?.bestScore?.studentId === username
        ) {
            const data = get(studentDataAtom);
            const newData = data.students.get(username)?.data.delete(currentLabel); // Remove current score from student for current label'
            if (newData) {
                set(studentDataAtom, data);
                updateTopScores({
                    classname: currentLabel,
                    studentId: username,
                    score: 'delete',
                    topScores: get(topScoresAtom),
                    setTopScores: setTopScores,
                    studentData: data,
                });
            }
        }
    });

    const handleResetScore = (label: string) => {
        setMessage({
            message: label,
            reload: false,
            action: 'resetResult',
            recipient: { username: selectedUser.username },
        });
        resetScore(selectedUser.username);
        // if topScores.contains(selectedUser) recalculate topscores(() => {setTopScores(käydään läpi... )})
    };

    return (
        <FloatingMenuItem tooltip={t('userGrid.actions.resetScore', { label: labelsValue.labels.get(currentLabel) })}>
            <IconButton
                color="inherit"
                onClick={() => {
                    handleResetScore(currentLabel);
                }}
                aria-label={t('userGrid.actions.resetScore', { label: labelsValue.labels.get(currentLabel) })}
            >
                <UndoIcon />
            </IconButton>
        </FloatingMenuItem>
    );
}
