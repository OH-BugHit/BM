import { useNavigate } from 'react-router-dom';
import LangSelect from '../LangSelect/LangSelect';
import style from './style.module.css';

interface Props {
    title?: string | null;
}

export default function Header({ title }: Props) {
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
                {title && <h1>{title}</h1>}
                <LangSelect />
            </header>
        </div>
    );
}
