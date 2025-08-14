import style from './style.module.css';
import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { availableUsernamesAtom, takenUsernamesAtom } from '../../atoms/state';
import { IconButton, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { LargeButton, Webcam } from '@genai-fi/base';

interface Props {
    registerStudent: (name: string, image: string) => void;
}

interface FormErrors {
    username?: 'missing' | 'long' | 'short' | 'takenFree' | 'taken';
    image?: 'missing';
}

export default function EnterUserInfo({ registerStudent: onUsername }: Props) {
    const { t } = useTranslation();
    const [users] = useAtom(availableUsernamesAtom);
    const [takenUsernames] = useAtom(takenUsernamesAtom);

    const [showRestore, setShowRestore] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [capture, setCapture] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [username, setUsername] = useState('');

    const handleCapture = useCallback((canvas: HTMLCanvasElement) => {
        setImage(canvas.toDataURL('image/png'));
        setCapture(false);
        setErrors((prev) => ({ ...prev, image: undefined }));
    }, []);

    const toggleCapture = () => {
        if (image) {
            setImage(null);
        } else {
            setCapture(true);
        }
    };

    const handleSubmit = () => {
        const trimmed = username.trim();
        const errs: FormErrors = {};

        if (!image) {
            errs.image = 'missing';
        }

        if (!trimmed) {
            errs.username = 'missing';
        } else if (trimmed.length < 3) {
            errs.username = 'short';
        } else if (trimmed.length > 30) {
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

        if (image) onUsername(trimmed, image);
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
        <div className={style.userContainer}>
            <div className={style.imageContainer}>
                {!image && (
                    <Webcam
                        size={512}
                        capture={capture}
                        onCapture={handleCapture}
                        interval={200}
                        direct
                    />
                )}

                {image && (
                    <img
                        src={image}
                        alt="Otettu kuva"
                        style={{ maxWidth: '100%' }}
                    />
                )}
            </div>

            {errors.image && <p style={{ color: 'red' }}>{t('enterUsername.messages.imageRequired')}</p>}
            <LargeButton
                onClick={toggleCapture}
                variant="contained"
            >
                {image ? t('enterUsername.actions.changePicture') : t('enterUsername.actions.takePicture')}
            </LargeButton>

            <div className={style.textField}>
                <TextField
                    label={t('enterUsername.labels.enterUsername')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    error={!!errors.username}
                    helperText={
                        errors.username ? t(`enterUsername.messages.usernameError.${errors.username}`) : undefined
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
                        <em>Palaa peliin</em>
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
    );
}
