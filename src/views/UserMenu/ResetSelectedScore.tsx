import { FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import { useTranslation } from 'react-i18next';
import { UserItemData } from '../../utils/types';
import FloatingMenuItem from '../../components/FloatingMenu/FloatingMenuItem';
import { useAtomValue, useSetAtom } from 'jotai';
import { labelsAtom, messageTransferAtom, studentDataAtom, topScoresAtom } from '../../atoms/state';
import { useAtomCallback } from 'jotai/utils';
import { updateTopScores } from '../../utils/updateTopScores';
import { useState } from 'react';

interface Props {
    selectedUser: UserItemData;
}
export default function ResetSelectedScore({ selectedUser }: Props) {
    const { t } = useTranslation();
    const labels = useAtomValue(labelsAtom);
    const [selected, setSelected] = useState<string>('');
    const setMessage = useSetAtom(messageTransferAtom);
    const setTopScores = useSetAtom(topScoresAtom);
    const studentData = useAtomValue(studentDataAtom);

    const studentEntries = studentData.students.get(selectedUser.username);

    const labelOptions = [];
    if (studentEntries) {
        for (const [label] of studentEntries.data.entries()) {
            labelOptions.push(label);
        }
    }

    const resetScore = useAtomCallback((get, set, username: string) => {
        if (selected !== null) {
            const topScores = get(topScoresAtom);
            const forLabel = topScores.scores.get(selected);
            if (
                forLabel?.thirdScore?.studentId === username ||
                forLabel?.secondScore?.studentId === username ||
                forLabel?.bestScore?.studentId === username
            ) {
                const data = get(studentDataAtom);
                const newData = data.students.get(username)?.data.delete(selected); // Remove current score from student for current label'
                if (newData) {
                    set(studentDataAtom, data);
                    updateTopScores({
                        classname: selected,
                        studentId: username,
                        score: 'delete',
                        topScores: get(topScoresAtom),
                        setTopScores: setTopScores,
                        studentData: data,
                    });
                }
            }
        }
    });

    const handleResetScore = () => {
        if (selected) {
            setMessage({
                message: selected,
                reload: false,
                action: 'resetResult',
                recipient: { username: selectedUser.username },
            });
            resetScore(selectedUser.username);
        }
        // if topScores.contains(selectedUser) recalculate topscores(() => {setTopScores(käydään läpi... )})
    };

    const handleTermChange = async (newValue: string | null) => {
        setSelected(newValue ?? '');
    };

    return (
        <>
            <FormControl
                fullWidth
                style={{
                    width: '100%',
                    minWidth: '170px',
                    maxWidth: '50dvw',
                    maxHeight: '600px',
                }}
            >
                <InputLabel id="term-label">{t('userGrid.actions.selectLabel')}</InputLabel>
                <Select
                    labelId="term-label"
                    value={selected}
                    onChange={(e) => handleTermChange(e.target.value)}
                >
                    {labelOptions
                        .slice()
                        .sort((a, b) => {
                            const va = labels?.labels?.get(a) ?? a;
                            const vb = labels?.labels?.get(b) ?? b;
                            return va.localeCompare(vb, 'fi', { sensitivity: 'base' });
                        })
                        .map((label) => (
                            <MenuItem
                                key={label}
                                value={label}
                            >
                                {labels?.labels?.get(label) ?? label}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
            <FloatingMenuItem tooltip={t('userGrid.actions.resetScore', { label: labels.labels.get(selected) })}>
                <IconButton
                    color="inherit"
                    disabled={selected === null}
                    onClick={() => {
                        handleResetScore();
                    }}
                    aria-label={t('userGrid.actions.resetScore', { label: labels.labels.get(selected) })}
                >
                    <UndoIcon />
                </IconButton>
            </FloatingMenuItem>
        </>
    );
}
