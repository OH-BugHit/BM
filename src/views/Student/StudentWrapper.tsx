import style from './style.module.css';
import { useAtom } from 'jotai';
import StudentProtocol from '../../services/StudentProtocol';
import Student from './Student';
import { configAtom, serverCodeAtom, usernameAtom } from '../../atoms/state';
import { useID } from '@knicos/genai-base';
import EnterUsername from '../../components/EnterUsername/EnterUsername';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';

export default function StudentWrapper() {
    const [serverCode] = useAtom(serverCodeAtom);
    const MYCODE = useID(5);
    const [config] = useAtom(configAtom);
    const [username, setUsername] = useAtom(usernameAtom);

    return (
        <StudentProtocol
            server={serverCode}
            mycode={MYCODE}
        >
            {config && !username && (
                <div style={{ justifyItems: 'center', width: '100%', height: '100%' }}>
                    <Header />
                    <div className={style.usernameInput}>
                        <EnterUsername
                            onUsername={(name: string) => {
                                setUsername(name);
                            }}
                        />
                    </div>

                    <Footer />
                </div>
            )}
            {config && username && <Student MYCODE={MYCODE} />}
        </StudentProtocol>
    );
}
