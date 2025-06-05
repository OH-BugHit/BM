import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import { useLeaveWarning } from '../../hooks/leaveBlocker';
import style from './style.module.css';

export default function Teacher() {
    useLeaveWarning(true);

    return (
        <div className={style.container}>
            <Header
                title={'Teacher'}
                block={true}
            />
            <div className={style.innerContainer}>
                <div className={style.studentControlContainer}>
                    Contains controller for app and controlling the word if only one etc...
                </div>
                <div className={style.topThreeContainer}>top 3</div>
                <div className={style.otherResultsContainer}>all else</div>
            </div>
            <Footer />
        </div>
    );
}
