import style from './style.module.css';
import Privacy from '../Privacy/Privacy';
import LangSelect from '../LangSelect/LangSelect';

type FooterProps = {
    hideLang?: boolean;
};

export default function Footer({ hideLang }: FooterProps) {
    return (
        <footer>
            <div className={style.privacy}>
                <Privacy />
            </div>
            <div className={style.langSelect}>{!hideLang && <LangSelect />}</div>
        </footer>
    );
}
