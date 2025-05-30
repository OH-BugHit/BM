import style from './style.module.css';
//import { testAtom } from '../../utils/state';
//import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { Button } from '@knicos/genai-base';
import { useNavigate } from 'react-router-dom';
import LangSelect from '../../components/LangSelect/LangSelect';
import Footer from '../../components/Footer/Footer';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { modelAtom } from '../../atoms/state';
import { loadModel } from '../../services/loadModel';

export default function Frontpage() {
    //const [count, setCount] = useAtom(testAtom);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [model, setModel] = useAtom(modelAtom);

    useEffect(() => {
        if (model === null) {
            loadModel().then((loadedModel) => {
                setModel(loadedModel);
            });
        } else {
            console.log('Model already loaded');
        }
    }, [model, setModel]);

    const toReadyGame = () => {
        navigate('/game/ready');
    };

    const toOwnGame = () => {
        navigate('/game/own');
    };

    return (
        <div className={style.container}>
            <div className={style.innerContainer}>
                <img
                    src="/logo192_bw.png"
                    alt="logo"
                    width={192}
                    height={192}
                />
                <h1>{t('common.title')}</h1>
                <Button
                    sx={{ fontSize: '14pt', minWidth: '140px' }}
                    onClick={toReadyGame}
                    variant="contained"
                >
                    {t('frontpage.readyImages')}
                </Button>
                <Button
                    sx={{ fontSize: '14pt', minWidth: '140px' }}
                    onClick={toOwnGame}
                    variant="contained"
                >
                    {t('frontpage.ownImages')}
                </Button>
                <LangSelect />
            </div>
            <Footer hideLang={true} />
        </div>
    );
}
