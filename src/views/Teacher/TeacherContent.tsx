import { useAtom } from 'jotai';
import style from './style.module.css';
import { activeViewAtom } from '../../atoms/state';
import { DatasetGallery } from '../DatasetGallery/DatasetGallery';
import UserGrid from '../UserGrid/UserGrid';
import TermChange from '../TermChange/TermChange';
import UserMenu from '../UserMenu/UserMenu';
import TermMenu from '../TermMenu/TermMenu';
import Scoreboard from '../Scoreboard/Scoreboard';
import ControlMenu from '../ControlMenu/ControlMenu';
export default function TeacherContent() {
    const [activeView] = useAtom(activeViewAtom);

    return (
        <div className={style.content}>
            <main>
                {activeView.overlay === 'trainingData' && <DatasetGallery />}
                {(activeView.active === 'userGrid' || activeView.active === 'userGridSimple') && (
                    <>
                        <UserMenu />
                        <UserGrid simpleMode={activeView.active === 'userGridSimple'} />
                    </>
                )}
                {activeView.active === 'termChange' && (
                    <>
                        <TermMenu />
                        <TermChange />
                    </>
                )}
                {activeView.active === 'default' && <Scoreboard />}
            </main>
            <div className={style.controlLayer}>
                <ControlMenu />
            </div>
        </div>
    );
}
