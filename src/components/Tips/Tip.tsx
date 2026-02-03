import { useTranslation } from 'react-i18next';
import style from './style.module.css';

interface Props {
    step: number;
    user: 'student' | 'teacher';
}

export default function Tip({ step, user }: Props) {
    const { t } = useTranslation();

    return (
        <div className={style.tip}>
            <p>{t(`guide.normal.steps.${user}.${step}.tip`)}</p>
        </div>
    );
}
