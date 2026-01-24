import { useTranslation } from 'react-i18next';
import style from './style.module.css';

interface Props {
    step: number;
}
export default function Tip({ step }: Props) {
    const { t } = useTranslation();

    return (
        <div className={style.tip}>
            <p>{t(`guide.normal.steps.${step}.tip`)}</p>
        </div>
    );
}
