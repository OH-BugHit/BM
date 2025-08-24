import style from './style.module.css';
import { useAtom } from 'jotai';
import { configAtom } from '../../atoms/state';
import { LargeButton, Webcam } from '@genai-fi/base';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { RegisterFormErrors } from './EnterUsername';
import { useTranslation } from 'react-i18next';

interface Props {
    errors: RegisterFormErrors;
    setErrors: Dispatch<SetStateAction<RegisterFormErrors>>;
    image: string | null;
    setImage: Dispatch<SetStateAction<string | null>>;
}
export default function ProfilePictureInput({ errors, setErrors, image, setImage }: Props) {
    const { t } = useTranslation();
    const [config] = useAtom(configAtom);
    const [capture, setCapture] = useState(false);

    const handleCapture = useCallback(
        (canvas: HTMLCanvasElement) => {
            setImage(canvas.toDataURL('image/png'));
            setCapture(false);
            setErrors((prev) => ({ ...prev, image: undefined }));
        },
        [setErrors, setImage]
    );
    if (!config.settings.profilePicture) {
        return;
    }

    const toggleCapture = () => {
        if (image) {
            setImage(null);
        } else {
            setCapture(true);
        }
    };

    return (
        <>
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
        </>
    );
}
