import { useAtomValue } from 'jotai';
import { activeViewAtom, configAtom } from '../../atoms/state';
import GalleryStudentStripped from './GalleryStudentStripped';
import DatasetGallery from './DatasetGallery';

export function StudentDatasetWrapper() {
    const activeView = useAtomValue(activeViewAtom);
    const config = useAtomValue(configAtom);

    if (config.settings.allowAllLabels) {
        return <DatasetGallery mode="student" />;
    }
    return (
        <>
            {config.gallery.force ? (
                <GalleryStudentStripped />
            ) : (
                activeView.overlay === 'datasetGallery' && config.gallery.on && <GalleryStudentStripped />
            )}{' '}
        </>
    );
}
