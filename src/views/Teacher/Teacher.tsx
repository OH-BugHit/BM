import { useAtom } from 'jotai';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import { useLeaveWarning } from '../../hooks/leaveBlocker';
import ServerProtocol from '../../services/ServerProtocol';
import style from './style.module.css';
import { configAtom } from '../../atoms/state';
import { useState } from 'react';
import { Button, useID } from '@knicos/genai-base';

export default function Teacher() {
    useLeaveWarning(true);
    const [, setConfig] = useAtom(configAtom);
    const [word, setWord] = useState('');
    const MYCODE = useID(5);

    const handleChangeConfig = () => {
        console.log('Lähetetään sana: ', word);
        setConfig({ data: word });
    };

    // Komennot lähetetään muokkaamalla config-atomia
    return (
        <div className={style.container}>
            <ServerProtocol code={MYCODE} />
            <p>{`address: ${MYCODE}`}</p>
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
            <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
            />
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
