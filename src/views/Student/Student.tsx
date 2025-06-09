import { Button } from '@knicos/genai-base';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import { useLeaveWarning } from '../../hooks/leaveBlocker';
import StudentProtocol, { useSpoofProtocol } from '../../services/StudentProtocol';
import style from './style.module.css';
import { useAtom } from 'jotai';
import { SpoofConfig } from '../../utils/types';
import { configAtom } from '../../atoms/state';

export default function Student() {
    useLeaveWarning(true);
    const { doSendScore, doSendImages } = useSpoofProtocol();
    const config = useAtom<SpoofConfig>(configAtom);

    const handleSendScore = () => {
        console.log('painettu lähetä');
        if (doSendScore) {
            console.log('sending data');
            doSendScore({ classname: 'string', score: 1 });
        }
    };

    return (
        <StudentProtocol server="123">
            <div className={style.container}>
                <Header
                    title={'Student'}
                    block={true}
                />
                <div>
                    {config && (
                        <Button
                            sx={{ fontSize: '14pt', minWidth: '40px', marginTop: '6px' }}
                            variant="contained"
                            onClick={() => {
                                handleSendScore();
                            }}
                        >
                            Lähetä testiä
                        </Button>
                    )}
                </div>
                <div className={style.innerContainer}>
                    <div className={style.studentControlContainer}>
                        Contains controller for app and controlling the word if only one etc...
                    </div>
                    <div className={style.topThreeContainer}>top 3</div>
                    <div className={style.otherResultsContainer}>all else</div>
                </div>
                <Footer />
            </div>
        </StudentProtocol>
    );
}
