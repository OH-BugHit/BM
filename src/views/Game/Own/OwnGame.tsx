import style from './style.module.css';
import { useTranslation } from 'react-i18next';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import { Button, Webcam } from '@knicos/genai-base';
import { useCallback, useState } from 'react';
import { useAtom } from 'jotai';
import { imageAtom } from '../../../utils/state';

export default function OwnGame() {
    const { t } = useTranslation();
    const [image, setImage] = useAtom(imageAtom);
    const [hasCaptured, setHasCaptured] = useState(false);
    const [capture, setCapture] = useState(false);

    const getImage = useCallback(
        (img: HTMLCanvasElement) => {
            setImage(img);
            setHasCaptured(true);
        },
        [setImage]
    );

    const resetCapture = () => {
        setImage(null);
        setHasCaptured(false);
        setCapture(false);
    };

    const startCapture = useCallback(() => setCapture(true), [setCapture]);
    const stopCapture = useCallback(() => setCapture(false), [setCapture]);

    return (
        <div className={style.container}>
            <Header />
            <div className={style.innerContainer}>
                <div className={style.innerContainer}>
                    <h1>{t('common.title')}</h1>
                    <h2>{t('game.own.title')}</h2>
                    {!hasCaptured && (
                        <>
                            <Webcam
                                size={224}
                                interval={1000}
                                onCapture={getImage}
                                capture={capture}
                            />
                            <Button
                                onMouseDown={startCapture}
                                onMouseUp={stopCapture}
                                onBlur={stopCapture}
                                onMouseLeave={stopCapture}
                                onTouchEnd={stopCapture}
                                onTouchCancel={stopCapture}
                            >
                                ota kuva
                            </Button>
                        </>
                    )}

                    {hasCaptured && image && (
                        <>
                            <img
                                src={image.toDataURL()}
                                alt="Kuvakaappaus"
                                style={{ width: '224px', height: '224px' }}
                            />
                            <Button onClick={resetCapture}>{t('game.own.takeNew', 'Ota uusi kuva')}</Button>
                        </>
                    )}
                    {/**Tähän tulee jotain alkuasetteluja kuten kuvan lataus*/}
                    {/**Tähän tulee valmis pelin aloituspainike, jonka painalluksen jälkeen peli alkaa */}
                    {/*&&ready niin renderöityy kuva, johon sitten */}
                </div>
            </div>
            <Footer />
        </div>
    );
}
