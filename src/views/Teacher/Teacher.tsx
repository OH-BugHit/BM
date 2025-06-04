import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import { useLeaveWarning } from '../../hooks/leaveBlocker';
import style from './style.module.css';

export default function Teacher() {
    useLeaveWarning(true);
    return (
        <div className={style.container}>
            <Header
                title={'Scoreboard'}
                block={true}
            />
            <div className={style.innerContainer}>asdasd</div>
            <Footer />
        </div>
    );
}
