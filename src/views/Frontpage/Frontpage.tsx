import style from './style.module.css';
import { testAtom } from '../../utils/state';
import { useAtom } from 'jotai';
import ButtonTest from '../../components/testComponent';
import Privacy from '../../components/Privacy/Privacy';
import { useTranslation } from 'react-i18next';

export default function Frontpage() {
    const [count, setCount] = useAtom(testAtom);
    const { t } = useTranslation();
    return (
        <div className={style.container}>
            <div className={style.innerContainer}>
                <header>
                    <img
                        src="/logo192_bw.png"
                        alt="logo"
                        width={192}
                        height={192}
                    />
                </header>
                <h1>{t('common.title')}</h1>
                <ButtonTest />
                <div className="card">
                    <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
                    <p>
                        Edit <code>src/App.tsx</code> and save to test HMR
                    </p>
                </div>
            </div>
            <Privacy position="bottomLeft" />
        </div>
    );
}
