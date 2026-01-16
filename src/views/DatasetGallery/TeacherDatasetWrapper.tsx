import { useAtom } from 'jotai';
import { DatasetGallery } from './DatasetGallery';
import { activeViewAtom } from '../../atoms/state';

export function TeacherDatasetWrapper() {
    const [activeView] = useAtom(activeViewAtom);
    return <>{activeView.active === 'datasetGallery' && <DatasetGallery mode="teacher" />} </>;
}
