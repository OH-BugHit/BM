import style from './style.module.css';
import { useAtom } from 'jotai';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { availableUsernamesAtom } from '../../atoms/state';
import { IconButton, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { LargeButton } from '@knicos/genai-base';

interface Props {
    onUsername: (name: string) => void;
    autoUsername?: boolean;
}

interface FormErrors {
    username?: 'missing' | 'long' | 'short';
}

export default function EnterUsername({ onUsername }: Props) {
    const { t } = useTranslation();
    const ref = useRef<HTMLInputElement>(null);
    // const [errors, setErrors] = useState<FormErrors>({});
    const [users] = useAtom(availableUsernamesAtom);
    const [showRestore, setShowRestore] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const doUsernameKey = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                const name = (e.target as HTMLInputElement).value;
                onUsername(name);
            }
        },
        [onUsername]
    );

    const doSelect = useCallback(
        (e: SelectChangeEvent) => {
            const name = e.target.value;
            const item = users.find((u) => u.username === name);
            if (item) {
                onUsername(item.username);
            }
        },
        [onUsername, users]
    );

    return (
        <div className={style.userContainer}>
            <TextField
                inputRef={ref}
                label={t('enterUsername.labels.enterUsername')}
                onKeyDown={doUsernameKey}
                required
                error={!!errors.username}
                helperText={errors.username ? t(`enterUsername.messages.usernameError.${errors.username}`) : undefined}
            />
            <LargeButton
                onClick={() => {
                    if (ref.current) {
                        if (!ref.current.value) {
                            setErrors({ username: 'missing' });
                            return;
                        }
                        if (ref.current.value.length > 30) {
                            setErrors({ username: 'long' });
                            return;
                        }
                        if (ref.current.value.length < 3) {
                            setErrors({ username: 'short' });
                            return;
                        }
                        onUsername(ref.current.value);
                    }
                }}
                variant="contained"
            >
                {t('enterUsername.actions.enterUser')}
            </LargeButton>
            {!showRestore && (
                <div>
                    <IconButton onClick={() => setShowRestore(true)}>
                        <RestoreIcon />
                    </IconButton>
                </div>
            )}
            {showRestore && (
                <Select
                    value=""
                    onChange={doSelect}
                >
                    {users.map((u) => (
                        <MenuItem
                            key={u.username}
                            value={u.username}
                        >
                            {u.username}
                        </MenuItem>
                    ))}
                </Select>
            )}
        </div>
    );
}
