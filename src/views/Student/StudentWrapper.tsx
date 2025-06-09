import StudentProtocol from '../../services/StudentProtocol';
import Student from './Student';

export default function StudentWrapper() {
    return (
        <StudentProtocol server="123">
            <Student />
        </StudentProtocol>
    );
}
