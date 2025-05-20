import style from './style.module.css';
//import { testAtom } from '../../utils/state';
//import { useAtom } from 'jotai';
import Privacy from '../../components/Privacy/Privacy';
import { useTranslation } from 'react-i18next';
import { Button } from '@knicos/genai-base';
import { useNavigate } from 'react-router-dom';
import LangSelect from '../../components/LangSelect/LangSelect';

export default function Frontpage() {
    //const [count, setCount] = useAtom(testAtom);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/game');
    };

    return (
        <div className={style.container}>
            <div className={style.innerContainer}>
                <header>
                    <img
                        src="/logo192_bw.png"
                        alt="logo"
                        width={192}
                        height={192}
                    />
                </header>
                <h1>{t('common.title')}</h1>
                <Button
                    sx={{ fontSize: '14pt', minWidth: '140px' }}
                    onClick={handleStart}
                    variant="contained"
                >
                    {t('common.start')}
                </Button>
                <LangSelect />
            </div>
            <Privacy position="bottomLeft" />
        </div>
    );
}
