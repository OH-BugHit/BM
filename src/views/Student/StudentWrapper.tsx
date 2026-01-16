import StudentProtocol from '../../services/StudentProtocol';
import { useID } from '@genai-fi/base';
import EnterUserInfo from '../EnterUsername/EnterUsername';
import Footer from '../../components/Footer/Footer';
import { useParams } from 'react-router-dom';
import { Peer } from '@genai-fi/base/hooks/peer';
import PeerEnv from '../../env';
import { useState } from 'react';
import Student from './Student';

export default function StudentWrapper() {
    console.log('rendering student wrap');
    const { serverCode } = useParams<{ serverCode: string }>();
    const MYCODE = useID(5);
    const [ready, setReady] = useState<boolean>(false);

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
                {!ready && (
                    <>
                        <EnterUserInfo onReady={() => setReady(true)} />
                        <Footer />
                    </>
                )}
                {ready && serverCode && <Student serverCode={serverCode} />}
            </StudentProtocol>
        </Peer>
    );
}
