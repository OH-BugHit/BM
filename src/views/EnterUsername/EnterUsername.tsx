import style from './style.module.css';
import { useAtom, useSetAtom } from 'jotai';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    availableUsernamesAtom,
    configAtom,
    profilePictureAtom,
    takenUsernamesAtom,
    usernameAtom,
} from '../../atoms/state';
import { IconButton, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { LargeButton } from '@genai-fi/base';
import ProfilePictureInput from './ProfilePictureInput';

interface Props {
    onReady: () => void;
}

export interface RegisterFormErrors {
    username?: 'missing' | 'long' | 'short' | 'takenFree' | 'taken';
    image?: 'missing';
}

export default function EnterUserInfo({ onReady }: Props) {
    const { t } = useTranslation();
    const [users] = useAtom(availableUsernamesAtom);
    const [takenUsernames] = useAtom(takenUsernamesAtom);
    const setProfilePicture = useSetAtom(profilePictureAtom);
    const [showRestore, setShowRestore] = useState(false);
    const [errors, setErrors] = useState<RegisterFormErrors>({});
    const [image, setImage] = useState<string | null>(null);
    const [username, setUsername] = useAtom(usernameAtom);
    const [config] = useAtom(configAtom);

    const onUsername = async (name: string, image: string | null) => {
        setUsername(name);
        setProfilePicture(image);
        onReady();
    };

    const handleSubmit = () => {
        const trimmed = username.trim();
        const errs: RegisterFormErrors = {};

        if (!image && config.settings.profilePicture) {
            errs.image = 'missing';
        }

        if (!trimmed) {
            errs.username = 'missing';
        } else if (trimmed.length < 3) {
            errs.username = 'short';
        } else if (trimmed.length > 16) {
            errs.username = 'long';
        } else if (users.find((u) => u.username === trimmed)) {
            errs.username = 'takenFree';
        } else if (takenUsernames.find((u) => u.username === trimmed)) {
            errs.username = 'taken';
        }

        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        onUsername(trimmed, image);
    };

    const handleSelect = (e: SelectChangeEvent) => {
        const name = e.target.value;
        const item = users.find((u) => u.username === name);
        if (item) {
            setErrors((prev) => ({ ...prev, username: undefined }));
            onUsername(e.target.value, '');
        }
    };

    return (
        <>
            {config && (
                <div className={config?.settings?.profilePicture ? style.enterUserInfo : style.noPicContainer}>
                    <ProfilePictureInput
                        errors={errors}
                        setErrors={setErrors}
                        setImage={setImage}
                        image={image}
                    />
                    <div className={style.textField}>
                        <TextField
                            label={t('enterUsername.labels.enterUsername')}
                            value={username}
                            sx={{ color: 'white' }}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            error={!!errors.username}
                            helperText={
                                errors.username
                                    ? t(`enterUsername.messages.usernameError.${errors.username}`)
                                    : undefined
                            }
                            fullWidth
                            margin="normal"
                        />
                    </div>
                    <LargeButton
                        onClick={handleSubmit}
                        variant="contained"
                    >
                        {t('enterUsername.actions.enterUser')}
                    </LargeButton>
                    <div className={style.restore}>
                        {!showRestore && (
                            <IconButton
                                onClick={() => setShowRestore(true)}
                                className={style.restoreButton}
                            >
                                <em>Return to Game</em>
                                <RestoreIcon />
                            </IconButton>
                        )}

                        {showRestore && (
                            <Select
                                value=""
                                onChange={handleSelect}
                                displayEmpty
                                fullWidth
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
                </div>
            )}
        </>
    );
}
