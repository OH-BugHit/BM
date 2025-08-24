import style from './style.module.css';
import { Autocomplete, TextField } from '@mui/material';
import { useAtom } from 'jotai';
import { usersAtom } from '../../atoms/state';
import { useTranslation } from 'react-i18next';
import React from 'react';
import TermSelector from './TermSelector';

export default function UserList() {
    const { t } = useTranslation();
    const [users] = useAtom(usersAtom);

    const [selectedUsernames, setSelectedUsernames] = React.useState<string[]>([]);

    return (
        <>
            <Autocomplete
                multiple
                options={(users || [])
                    .map((u) => u.username)
                    .sort((a, b) => a.localeCompare(b, 'fi', { sensitivity: 'base' }))}
                value={selectedUsernames}
                onChange={(_, newValue) => {
                    setSelectedUsernames(newValue);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={t('termSelect.titles.selectUsers')}
                    />
                )}
                className={style.termSelector}
            />
            <TermSelector toUsers={selectedUsernames} />
        </>
    );
}
