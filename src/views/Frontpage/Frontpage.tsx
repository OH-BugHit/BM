import style from './style.module.css';
import { testAtom } from '../../utils/state';
import { useAtom } from 'jotai';
import ButtonTest from '../../components/testComponent';
import Privacy from '../../components/Privacy/Privacy';

export default function Frontpage() {
    const [count, setCount] = useAtom(testAtom);
    return (
        <>
            <div className={style.container}>
                <ButtonTest />
            </div>
            <h1>BiasGame</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <Privacy position="bottomLeft" />
        </>
    );
}
