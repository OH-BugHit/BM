import { useSpoofProtocol } from '../../services/StudentProtocol';
import Student from './Student';

export default function StudentWrapper() {
    const { doSendScore, doSendImages } = useSpoofProtocol();
    return <Student />;
}
