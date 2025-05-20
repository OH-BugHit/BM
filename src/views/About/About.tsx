import { useTranslation } from 'react-i18next';
import style from './style.module.css';
import Markdown from 'react-markdown';

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

                <h2>{t('about.privacyTitle')}</h2>
                <Markdown>{(t('about.privacy', { returnObjects: true }) as string[]).join('\n\n')}</Markdown>
            </main>
        </div>
    );
}
