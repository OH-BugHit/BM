import style from './style.module.css';
import Privacy from '../Privacy/Privacy';
import LangSelect from '../LangSelect/LangSelect';
import React from 'react';

type FooterProps = {
    hideLang: boolean;
};

function Footer({ hideLang }: FooterProps) {
    return (
        <footer>
            <div className={style.privacy}>
                <Privacy />
            </div>
            <div className={style.langSelect}>{!hideLang && <LangSelect />}</div>
        </footer>
    );
}

export default React.memo(Footer);
