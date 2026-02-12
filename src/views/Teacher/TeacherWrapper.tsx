import { useAtomValue } from 'jotai';
import { modelAtom } from '../../atoms/state';
import Teacher from './Teacher';
import ModelLoader from '../../utils/ModelLoader';

export default function TeacherWrapper() {
    const model = useAtomValue(modelAtom);
    if (!model) {
        return <ModelLoader />;
    }
    return <Teacher />;
}
