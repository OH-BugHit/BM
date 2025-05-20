import style from './style.module.css';
import Privacy from '../Privacy/Privacy';

export default function Footer() {
    return (
        <div className={style.container}>
            <footer>
                <Privacy position="bottomLeft" />;
            </footer>
        </div>
    );
}
