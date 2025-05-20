import { useNavigate } from 'react-router-dom';
import LangSelect from '../LangSelect/LangSelect';
import style from './style.module.css';

export default function Header() {
    const navigate = useNavigate();
    const toMain = () => {
        navigate('/');
    };
    return (
        <div className={style.container}>
            <header>
                <img
                    src="/logo192_bw.png"
                    alt="logo"
                    width={64}
                    height={64}
                    style={{ cursor: 'pointer' }}
                    onClick={toMain}
                />
                <LangSelect />
            </header>
        </div>
    );
}
