import style from './style.module.css';
import { useAtom } from 'jotai';
import StudentProtocol from '../../services/StudentProtocol';
import Student from './Student';
import { configAtom, profilePictureAtom, usernameAtom } from '../../atoms/state';
import { useID } from '@knicos/genai-base';
import EnterUserInfo from '../../components/EnterUsername/EnterUsername';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import { useParams } from 'react-router-dom';

export default function StudentWrapper() {
    const { serverCode } = useParams<{ serverCode: string }>();
    const MYCODE = useID(5);
    const [config] = useAtom(configAtom);
    const [username, setUsername] = useAtom(usernameAtom);
    const [, setProfilePicture] = useAtom(profilePictureAtom);

    const registerStudent = async (name: string, image: string) => {
        setUsername(name);
        setProfilePicture(image);
    };

    return (
        <StudentProtocol
            server={serverCode}
            mycode={MYCODE}
        >
            {config && !username && (
                <div style={{ justifyItems: 'center', width: '100%', height: '100%' }}>
                    <Header />
                    <div className={style.usernameInput}>
                        <EnterUserInfo registerStudent={registerStudent} />
                    </div>
                    <Footer />
                </div>
            )}
            {config && username && serverCode && <Student serverCode={serverCode} />}
        </StudentProtocol>
    );
}
