import { useTranslation } from 'react-i18next';
import style from './style.module.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Props {
    doShowBottomMenu: () => void;
    open: boolean;
}
export default function HeaderRow({ doShowBottomMenu, open }: Props) {
    const { t } = useTranslation();
    return (
        <div className={open ? style.logoRowOpen : style.logoRow}>
            <div className={style.backgroundLogo}>
                <img
                    src="/logo48_bw_invert.png"
                    width={48}
                    height={48}
                    alt="Spoofgame logo"
                />
            </div>
            {open && <h1 className={style.title}>{t('common.title')}</h1>}
            <div style={{ flexGrow: 1 }} />
            {open && (
                <div style={{}}>
                    <ExpandMoreIcon
                        fontSize="large"
                        sx={{ width: '3.5rem', height: '3.5rem' }}
                        className={style.expandIcon}
                        onClick={doShowBottomMenu}
                    />
                </div>
            )}
        </div>
    );
}
