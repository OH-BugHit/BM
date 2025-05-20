import style from './style.module.css';
import { useTranslation } from 'react-i18next';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';

export default function OwnGame() {
    const { t } = useTranslation();

    return (
        <div className={style.container}>
            <Header />
            <div className={style.innerContainer}>
                <div className={style.innerContainer}>
                    <h1>{t('common.title')}</h1>
                    <h2>{t('game.own.title')}</h2>
                    {/**Tähän tulee jotain alkuasetteluja */}
                    {/**Tähän tulee valmis pelin aloituspainike, jonka painalluksen jälkeen peli alkaa */}
                    {/*&&ready niin renderöityy kuva, johon sitten */}
                </div>
            </div>
            <Footer />
        </div>
    );
}
