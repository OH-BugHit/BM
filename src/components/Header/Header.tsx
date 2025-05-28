import { useNavigate } from 'react-router-dom';
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
            {title && <h1>{title}</h1>}
            <header>
                <img
                    src="/logo192_bw.png"
                    alt="logo"
                    width={64}
                    height={64}
                    style={{ cursor: 'pointer' }}
                    onClick={toMain}
                />
                <img
                    src="/home.png"
                    alt="logo"
                    width={52}
                    height={52}
                    style={{ cursor: 'pointer', opacity: '0.7' }}
                    onClick={toMain}
                />
            </header>
        </div>
    );
}
