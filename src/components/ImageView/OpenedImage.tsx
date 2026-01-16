import style from './style.module.css';
import { Button } from '@genai-fi/base';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { close } from '../../components/Buttons/buttonStyles';
import { useTranslation } from 'react-i18next';
import { Dispatch } from 'react';
import { SetStateAction } from 'jotai';

interface Props {
    setOpenImage: Dispatch<SetStateAction<string | null>>;
    openImage: string | null;
}

export default function OpenedImage({ setOpenImage, openImage }: Props) {
    const { t } = useTranslation();

    if (!openImage) {
        return;
    }

    return (
        <div
            className={style.openImageOverlay2}
            onClick={() => setOpenImage(null)}
        >
            <div className={style.imageContainer}>
                <Button
                    onClick={() => setOpenImage(null)}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    style={close as any}
                    title={t('common.close')}
                    aria-label="Sulje"
                >
                    <CloseSharpIcon />
                </Button>{' '}
                <img
                    src={openImage}
                    alt="isompi kuva"
                    style={{ maxWidth: '90vw', maxHeight: '90vh', boxShadow: '0 0 24px #000' }}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
}
