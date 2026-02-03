import { useAtom } from 'jotai';
import { activeViewAtom } from '../../atoms/state';
import DatasetGallery from './DatasetGallery';

export function TeacherDatasetWrapper() {
    const [activeView] = useAtom(activeViewAtom);
    return <>{activeView.active === 'datasetGallery' && <DatasetGallery mode="teacher" />} </>;
}
