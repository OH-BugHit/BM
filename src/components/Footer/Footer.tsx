import style from './style.module.css';
import Privacy from '../Privacy/Privacy';
import LangSelect from '../LangSelect/LangSelect';

type FooterProps = {
    hideLang?: boolean;
};

export default function Footer({ hideLang }: FooterProps) {
    return (
        <div className={style.container}>
            <footer>
                <Privacy />
            </footer>
            {!hideLang && <LangSelect />}
        </div>
    );
}
