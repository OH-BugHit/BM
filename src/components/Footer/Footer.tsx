import style from './style.module.css';
import Privacy from '../Privacy/Privacy';
import LangSelect from '../LangSelect/LangSelect';
import React from 'react';
import { useAtomValue } from 'jotai';
import { isOutOfFocusAtom } from '../../atoms/state';

type FooterProps = {
    hideLang: boolean;
};

function Footer({ hideLang }: FooterProps) {
    const isOutOfFocus = useAtomValue(isOutOfFocusAtom);
    return (
        <footer inert={isOutOfFocus}>
            <div className={style.privacy}>
                <Privacy />
            </div>
            <div className={style.langSelect}>{!hideLang && <LangSelect />}</div>
        </footer>
    );
}

export default React.memo(Footer);
