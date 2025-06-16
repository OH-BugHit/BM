import { useAtom } from 'jotai';
import StudentProtocol from '../../services/StudentProtocol';
import Student from './Student';
import { serverCodeAtom } from '../../atoms/state';
import { useID } from '@knicos/genai-base';

export default function StudentWrapper() {
    const [serverCode] = useAtom(serverCodeAtom);
    const MYCODE = useID(5);
    return (
        <StudentProtocol
            server={serverCode}
            mycode={MYCODE}
        >
            <Student MYCODE={MYCODE} />
        </StudentProtocol>
    );
}
