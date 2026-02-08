import { useAtom, useAtomValue } from 'jotai';
import { activeViewAtom, configAtom } from '../../atoms/state';
import DatasetGallery from './DatasetGallery';

export function StudentDatasetWrapper() {
    const activeView = useAtomValue(activeViewAtom);
    const [config] = useAtom(configAtom);
    return (
        <>
            {config.gallery.force ? (
                <DatasetGallery mode="student" />
            ) : (
                activeView.overlay === 'datasetGallery' && config.gallery.on && <DatasetGallery mode="student" />
            )}{' '}
        </>
    );
}
