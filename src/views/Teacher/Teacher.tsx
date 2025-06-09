// import { useAtom } from 'jotai';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import { useLeaveWarning } from '../../hooks/leaveBlocker';
import ServerProtocol from '../../services/ServerProtocol';
import style from './style.module.css';
//import { configAtom } from '../../atoms/state';
//import { useState } from 'react';
import { Button } from '@knicos/genai-base';

export default function Teacher() {
    useLeaveWarning(true);
    //const [config, setConfig] = useAtom(configAtom);
    //const [word, setWord] = useState('');

    const handleChangeConfig = () => {
        //setConfig(word)
    };

    // Komennot lähetetään muokkaamalla config-atomia
    return (
        <div className={style.container}>
            <ServerProtocol code={'123'} />
            <p>spoof_123</p>
            <Header
                title={'Teacher'}
                block={true}
            />
            <Button
                sx={{ fontSize: '14pt', minWidth: '40px', marginTop: '6px' }}
                variant="contained"
                onClick={() => {
                    handleChangeConfig();
                }}
            >
                Lähetä testiä
            </Button>
            <div className={style.innerContainer}>
                <div className={style.studentControlContainer}>
                    Contains controller for app and controlling the word if only one etc...
                </div>
                <div className={style.topThreeContainer}>top 3</div>
                <div className={style.otherResultsContainer}>all else</div>
            </div>
            <Footer />
        </div>
    );
}
