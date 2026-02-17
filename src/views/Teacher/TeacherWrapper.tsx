import { useAtomValue, useSetAtom } from 'jotai';
import { modelAtom, sessionCodeAtom } from '../../atoms/state';
import Teacher from './Teacher';
import { useID } from '@genai-fi/base';
import ModelLoader from '../../utils/ModelLoader';

export default function TeacherWrapper() {
    const setSessionCode = useSetAtom(sessionCodeAtom);
    const model = useAtomValue(modelAtom);

    const ID = useID(5);
    setSessionCode(ID);

    if (!model) {
        return <ModelLoader />;
    }

    return <Teacher ID={ID} />;
}
