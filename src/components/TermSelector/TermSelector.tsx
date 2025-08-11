import { useTranslation } from 'react-i18next';

import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { configAtom, selectedTermAtom, selectedUserAtom, settingAtom, termTransferAtom } from '../../atoms/state';
import { useAtom } from 'jotai';

export default function TermSelector({ allLabels }: { allLabels: string[] }) {
    const { t } = useTranslation();
    const [, setTerm] = useAtom(termTransferAtom);
    const [word, setWord] = useAtom(selectedTermAtom);
    const [config, setConfig] = useAtom(configAtom);
    const [selectedUser] = useAtom(selectedUserAtom);
    const [settings] = useAtom(settingAtom);

    return (
        <Autocomplete
            options={(allLabels || []).slice().sort((a, b) => a.localeCompare(b, 'fi', { sensitivity: 'base' }))}
            value={word}
            style={{
                padding: '4px',
                margin: '1rem',
                minWidth: '400px',
                maxWidth: '600px',
                width: '100%',
            }}
            onChange={(_, newValue) => {
                setWord(newValue || '');
                setConfig({
                    ...config,
                    pause: config.pause || settings.pauseOnChange,
                });
                setTerm({
                    term: newValue || '',
                    recipient: config.gameMode === 'all' ? { username: 'a' } : { username: selectedUser.username },
                });
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={t('common.selectLabel')}
                />
            )}
        />
    );
}
