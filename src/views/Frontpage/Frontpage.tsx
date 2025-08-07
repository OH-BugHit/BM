import style from './style.module.css';
import { useTranslation } from 'react-i18next';
import { Button } from '@knicos/genai-base';
import { useNavigate } from 'react-router-dom';
import LangSelect from '../../components/LangSelect/LangSelect';
import Footer from '../../components/Footer/Footer';

import { useState } from 'react';
import { TextField } from '@mui/material';
import { useModelNamesLoader } from '../../hooks/useModelNamesLoader';

export default function Frontpage() {
    useModelNamesLoader();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [inputCode, setInputCode] = useState<string>('');

    const toStudent = () => {
        navigate(`/student/${inputCode}/main`);
    };

    const toTeacher = () => {
        navigate('/library/');
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
                <div className={style.startBox}>
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
                <LangSelect />
            </div>
            <Footer hideLang={true} />
        </div>
    );
}
