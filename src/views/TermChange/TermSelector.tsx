import style from '../../views/TermChange/style.module.css';
import { useTranslation } from 'react-i18next';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { configAtom, labelsAtom, modelAtom, settingAtom, termTransferAtom } from '../../atoms/state';
import { useAtom } from 'jotai';
import { useState } from 'react';

interface Props {
    toUsers?: string[];
}

export default function TermSelector({ toUsers }: Props) {
    const { t } = useTranslation();
    const [, setTerm] = useAtom(termTransferAtom);
    const [word, setWord] = useState('');
    const [config, setConfig] = useAtom(configAtom);
    const [settings] = useAtom(settingAtom);
    const [labels] = useAtom(labelsAtom);
    const [model] = useAtom(modelAtom);

    function delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function sendTerms(newValue: string, toUsers: string[]) {
        for (const user of toUsers) {
            setTerm({
                term: newValue || '',
                recipient: { username: user },
            });
            await delay(100); // delay for P2P connection to have time
        }
    }

    const handleTermChange = async (newValue: string | null) => {
        if (toUsers) {
            await sendTerms(newValue || '', toUsers);
        } else {
            setWord(newValue || '');
            setConfig({
                ...config,
                pause: config.pause || settings.pauseOnChange,
            });
            setTerm({
                term: newValue || '',
                recipient: { username: 'a' },
            });
        }
    };
    const labelOptions = model?.getLabels() ?? [];
    const validWord = labelOptions.includes(word) ? word : '';
    return (
        <FormControl
            fullWidth
            className={style.termSelector}
        >
            <InputLabel id="term-label">{t('common.selectLabel')}</InputLabel>
            <Select
                labelId="term-label"
                value={validWord}
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
    );
}
