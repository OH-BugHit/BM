import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import style from './webcamInput.module.css';
import { configAtom, studentControlsAtom } from '../../../atoms/state';

export default function PauseLayer() {
    const { t } = useTranslation();
    const config = useAtomValue(configAtom);
    const controls = useAtomValue(studentControlsAtom);

    return <>{(controls.pause || config.pause) && <div className={style.pauseLayer}>{t('common.paused')}</div>}</>;
}
