import { useAtom } from 'jotai';
import style from './style.module.css';
import { activeViewAtom } from '../../atoms/state';
import UserGrid from '../UserGrid/UserGrid';
import TermChange from '../TermChange/TermChange';
import UserMenu from '../UserMenu/UserMenu';
import Scoreboard from '../Scoreboard/Scoreboard';
import ControlMenu from '../ControlMenu/ControlMenu';
import { TeacherDatasetWrapper } from '../DatasetGallery/TeacherDatasetWrapper';
import Tips from '../../components/Tips/Tips';
import TermMenu from '../TermChange/TermMenu/TermMenu';
import React from 'react';

function TeacherContent() {
    const [activeView] = useAtom(activeViewAtom);

    return (
        <div className={style.content}>
            <>
                <TeacherDatasetWrapper />
                {(activeView.active === 'userGrid' || activeView.active === 'userGridSimple') && (
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
                {activeView.active === 'results' && <Scoreboard />}
            </>
            <div className={style.controlLayer}>
                <Tips user="teacher" />
                <ControlMenu />
            </div>
        </div>
    );
}

export default React.memo(TeacherContent);
