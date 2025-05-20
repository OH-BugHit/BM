import { useTranslation } from 'react-i18next';
import style from './style.module.css';

export default function About() {
    const { t } = useTranslation();
    return (
        <div className={style.container}>
            <main>
                <header>
                    <img
                        src="/logo192_bw.png"
                        alt="logo"
                        width={128}
                        height={128}
                    />
                    <h1>{t('about.title')}</h1>
                </header>
            </main>
        </div>
    );
}
