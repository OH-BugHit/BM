import { useNavigate } from 'react-router-dom';
import style from './style.module.css';

interface Props {
    title?: string | null;
    block?: boolean | null;
}

export default function Header({ title, block }: Props) {
    const navigate = useNavigate();
    const toMain = () => {
        if (block) {
            const confirmLeave = window.confirm('Sinulla on tallentamattomia muutoksia. Haluatko varmasti poistua?');
            if (!confirmLeave) return;
        }
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
