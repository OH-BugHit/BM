import style from './style.module.css';
import { useTranslation } from 'react-i18next';

interface Props {
    position?: 'bottomLeft' | 'topRight';
}

export default function Privacy({ position = 'bottomLeft' }: Props) {
    const { t } = useTranslation();

    return (
        <section className={`${style.policy} ${style[position]}`}>
            {position === 'topRight' && (
                <a
                    href="/about"
                    target="_blank"
                >
                    {t('about.privacyTitle')}
                </a>
            )}
            {position === 'bottomLeft' && (
                <a
                    href="/about"
                    target="_blank"
                >
                    {t('about.privacyTitle')}
                </a>
            )}
        </section>
    );
}
