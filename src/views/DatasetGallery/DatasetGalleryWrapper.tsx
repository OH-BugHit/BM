import { useAtom } from 'jotai';
import { DatasetGallery } from './DatasetGallery';
import { activeViewAtom, configAtom } from '../../atoms/state';

export function DatasetGalleryWrapper() {
    const [activeView] = useAtom(activeViewAtom);
    const [config] = useAtom(configAtom);
    return <>{activeView.overlay === 'trainingData' && config.gallery && <DatasetGallery />} </>;
}
