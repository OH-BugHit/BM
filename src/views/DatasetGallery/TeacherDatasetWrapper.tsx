import { useAtom } from 'jotai';
import { activeViewAtom } from '../../atoms/state';
import DatasetGallery from './DatasetGallery';
import { ModelOrigin } from '../../utils/types';
import DatasetGalleryRemote from './DatasetGalleryRemote';

export function TeacherDatasetWrapper() {
    const [activeView] = useAtom(activeViewAtom);
    const params = new URLSearchParams(location.search);

    if (params.get('origin' as ModelOrigin) !== ModelOrigin.GenAI) {
        return <>{activeView.active === 'datasetGallery' && <DatasetGalleryRemote />} </>;
    }
    return <>{activeView.active === 'datasetGallery' && <DatasetGallery mode="teacher" />} </>;
}
