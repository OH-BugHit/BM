import { useAtom, useAtomValue } from 'jotai';
import { activeViewAtom, configAtom } from '../../atoms/state';
import DatasetGallery from './DatasetGallery';

export function StudentDatasetWrapper() {
    const activeView = useAtomValue(activeViewAtom);
    const [config] = useAtom(configAtom);
    return <>{activeView.overlay === 'datasetGallery' && config.gallery && <DatasetGallery mode="student" />} </>;
}
