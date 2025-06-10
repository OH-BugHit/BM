import style from './style.module.css';
import { useTranslation } from 'react-i18next';
import { Button } from '@knicos/genai-base';
import { useNavigate } from 'react-router-dom';
import LangSelect from '../../components/LangSelect/LangSelect';
import Footer from '../../components/Footer/Footer';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { modelAtom, serverCodeAtom } from '../../atoms/state';
import { loadModel } from '../../services/loadModel';
import { TextField } from '@mui/material';

export default function Frontpage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [model, setModel] = useAtom(modelAtom);
    const [modeSelection, setModeSelection] = useState<number>(0);
    const [inputCode, setInputCode] = useState<string>('');
    const [, setServerCode] = useAtom(serverCodeAtom);

    useEffect(() => {
        if (model === null) {
            loadModel().then((loadedModel) => {
                setModel(loadedModel);
                console.log('Model loaded');
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

    const toStudent = () => {
        console.log('inputcode:', inputCode);
        setServerCode(inputCode);
        navigate('/student/main');
    };

    const toTeacher = () => {
        navigate('/teacher/main');
    };

    const toggleMode = (mode: number) => {
        setModeSelection((prev) => (prev === mode ? 0 : mode));
        console.log(mode);
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
                <div className={style.modeContainer}>
                    <div
                        className={style.modeItem}
                        onClick={() => toggleMode(1)}
                    >
                        <div className={modeSelection === 1 ? style.initialClosed : style.initialOpen}>
                            <img
                                src="/logo192_bw.png"
                                alt="logo"
                                width={160}
                                height={160}
                            />
                            <h2>{t('frontpage.singleplayer')}</h2>
                        </div>
                        <div
                            className={`${style.collapsibleContent} ${
                                modeSelection === 1 ? style.expanded : style.collapsed
                            }`}
                        >
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
                        </div>
                    </div>
                    <div
                        className={style.modeItem}
                        onClick={() => toggleMode(2)}
                    >
                        <div className={modeSelection === 2 ? style.initialClosed : style.initialOpen}>
                            <img
                                src="/logo192_bw.png"
                                alt="logo"
                                width={160}
                                height={160}
                            />
                            <h2>{t('frontpage.multiplayer')}</h2>
                        </div>
                        <div
                            className={`${style.collapsibleContent} ${
                                modeSelection === 2 ? style.expanded : style.collapsed
                            }`}
                        >
                            <TextField
                                label={t('frontpage.labels.enterCode')}
                                value={inputCode}
                                fullWidth
                                className={style.textbox}
                                onChange={(e) => setInputCode(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <Button
                                sx={{ fontSize: '14pt', minWidth: '140px' }}
                                onClick={toStudent}
                                variant="contained"
                                disabled={inputCode.length < 5}
                            >
                                {t('common.start')}
                            </Button>
                            <div className={style.or}>{t('common.or')}</div>
                            <Button
                                sx={{ fontSize: '14pt', minWidth: '140px' }}
                                onClick={toTeacher}
                                variant="outlined"
                            >
                                {t('common.createNew')}
                            </Button>
                        </div>
                    </div>
                </div>
                <LangSelect />
            </div>
            <Footer hideLang={true} />
        </div>
    );
}
