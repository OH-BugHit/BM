import { useAtom } from 'jotai';
import style from './style.module.css';
import { activeViewAtom } from '../../atoms/state';
import { DatasetGallery } from '../DatasetGallery/DatasetGallery';
import UserGrid from '../UserGrid/UserGrid';
import TermChange from '../TermChange/TermChange';
import UserMenu from '../UserMenu/UserMenu';
import TermMenu from '../TermMenu/TermMenu';
import Scoreboard from '../Scoreboard/Scoreboard';
import ControlMenu from '../ControlMenu/UserMenu';
export default function TeacherContent() {
    console.log(`TeacherContent-module rerendered`);
    const [activeView] = useAtom(activeViewAtom);

    return (
        <div className={style.content}>
            {activeView.overlay === 'trainingData' && <DatasetGallery />}
            {activeView.active === 'userGrid' /*&& studentData */ && (
                <>
                    <UserMenu />
                    <UserGrid />
                </>
            )}
            {activeView.active === 'termChange' && (
                <>
                    <TermMenu />
                    <TermChange />
                </>
            )}
            {activeView.active === 'default' && <Scoreboard />}
            <ControlMenu />
        </div>
    );
}
