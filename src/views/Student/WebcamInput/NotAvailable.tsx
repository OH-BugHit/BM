import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import style from './webcamInput.module.css';
import { cameraActivatedAtom } from '../../../atoms/state';

export default function NotAvailable() {
    const { t } = useTranslation();
    const isCameraActive = useAtomValue<boolean>(cameraActivatedAtom);

    return <>{!isCameraActive && <div className={style.cameraNotActive}>{t('webcam.notAvailable')}</div>}</>;
}
