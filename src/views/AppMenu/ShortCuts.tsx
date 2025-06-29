import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import style from './style.module.css';
import { MenuButton } from '../../components/Buttons/MenuButton';
import AppsIcon from '@mui/icons-material/Apps';
import IconMenuItem from '../../components/IconMenu/Items';

export default function ShortCuts() {
    const { t } = useTranslation();
    const { search, pathname } = useLocation();
    const navigate = useNavigate();

    const page = pathname.split('/').pop();

    return (
        <div className={style.treeContainer}>
            <IconMenuItem
                tooltip={t('menu.vis.usergrid')}
                fullWidth
                selected={page === 'usergrid'}
            >
                <MenuButton
                    color="inherit"
                    aria-label={t('menu.vis.usergrid')}
                    size="large"
                    variant="text"
                    fullWidth
                    onClick={() => navigate('usergrid' + search)}
                >
                    <AppsIcon fontSize="large" />
                </MenuButton>
            </IconMenuItem>
        </div>
    );
}
