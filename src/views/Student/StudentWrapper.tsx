import { useAtom } from 'jotai';
import StudentProtocol from '../../services/StudentProtocol';
import Student from './Student';
import { configAtom, profilePictureAtom, usernameAtom } from '../../atoms/state';
import { useID } from '@genai-fi/base';
import EnterUserInfo from '../EnterUsername/EnterUsername';
import Footer from '../../components/Footer/Footer';
import { useParams } from 'react-router-dom';
import { Peer } from '@genai-fi/base/hooks/peer';
import PeerEnv from '../../env';

export default function StudentWrapper() {
    const { serverCode } = useParams<{ serverCode: string }>();
    const MYCODE = useID(5);
    const [config] = useAtom(configAtom);
    const [username, setUsername] = useAtom(usernameAtom);
    const [, setProfilePicture] = useAtom(profilePictureAtom);

    const registerStudent = async (name: string, image: string | null) => {
        setUsername(name);
        setProfilePicture(image);
    };

    return (
        <Peer
            host={PeerEnv.host}
            secure={PeerEnv.secure}
            peerkey={PeerEnv.peerkey}
            port={PeerEnv.port}
            code={`spoof-${MYCODE}`}
            server={`spoof-${serverCode}`}
        >
            <StudentProtocol>
                {config && !username && (
                    <>
                        <EnterUserInfo registerStudent={registerStudent} />
                        <Footer />
                    </>
                )}
                {config && username && serverCode && <Student serverCode={serverCode} />}
            </StudentProtocol>
        </Peer>
    );
}
