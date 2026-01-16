import { useAtom, useAtomValue } from 'jotai';
import { DatasetGallery } from './DatasetGallery';
import { activeViewAtom, configAtom } from '../../atoms/state';

export function StudentDatasetWrapper() {
    const activeView = useAtomValue(activeViewAtom);
    const [config] = useAtom(configAtom);
    return <>{activeView.overlay === 'datasetGallery' && config.gallery && <DatasetGallery mode="student" />} </>;
}
