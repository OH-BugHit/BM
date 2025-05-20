import style from './style.module.css';
import { useTranslation } from 'react-i18next';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { imageAtom } from '../../../utils/state';
import { Button } from '@knicos/genai-base';
import CameraCapture from '../../../components/CameraCapture/CameraCapture';
import FileUploadCapture from '../../../components/FileUploader/FileUploadCapture';

export default function OwnGame() {
    const { t } = useTranslation();
    const [image, setImage] = useAtom(imageAtom);
    const [hasCaptured, setHasCaptured] = useState(false);
    const [method, setMethod] = useState<'camera' | 'upload' | null>(null);

    const resetCapture = () => {
        setImage(null);
        setHasCaptured(false);
        setMethod(null);
    };

    return (
        <div className={style.container}>
            <Header title={t('common.title')} />
            <div className={style.innerContainer}>
                <div className={style.innerContainer}>
                    <h2>{t('game.own.title')}</h2>

                    {!hasCaptured && method === null && (
                        <div className={style.selectionButtons}>
                            <Button onClick={() => setMethod('camera')}>
                                {t('game.own.useCamera', 'Käytä kameraa')}
                            </Button>
                            <Button onClick={() => setMethod('upload')}>
                                {t('game.own.uploadFile', 'Lataa kuva tiedostosta')}
                            </Button>
                        </div>
                    )}

                    {!hasCaptured && method === 'camera' && (
                        <CameraCapture
                            onCapture={setImage}
                            onDone={() => setHasCaptured(true)}
                        />
                    )}

                    {!hasCaptured && method === 'upload' && (
                        <FileUploadCapture
                            onCapture={setImage}
                            onDone={() => setHasCaptured(true)}
                        />
                    )}

                    {hasCaptured && image && (
                        <>
                            <img
                                src={image.toDataURL()}
                                alt="Kuvakaappaus"
                                style={{ width: '224px', height: '224px' }}
                            />
                            <Button onClick={resetCapture}>{t('game.own.takeNew', 'Vaihda kuva')}</Button>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
