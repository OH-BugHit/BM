import { useAtomValue } from 'jotai';
import style from './style.module.css';
import { activeViewAtom } from '../../atoms/state';
import UserGrid from '../UserGrid/UserGrid';
import TermChange from '../TermChange/TermChange';
import Scoreboard from '../Scoreboard/Scoreboard';
import ControlMenu from '../ControlMenu/ControlMenu';
import { TeacherDatasetWrapper } from '../DatasetGallery/TeacherDatasetWrapper';
import Tips from '../../components/Tips/Tips';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { TeacherViews } from '../../utils/types';

function TeacherContent() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const activeView = useAtomValue(activeViewAtom);
    const view = searchParams.get('view') as TeacherViews;

    const title = (): string => {
        switch (view) {
            case 'connect': {
                return `${t('guide.normal.steps.teacher.1.title')}`;
            }
            case 'explore': {
                return `${t('guide.normal.steps.teacher.3.title')}`;
            }
            case 'heatmap': {
                return `${t('guide.normal.steps.teacher.4.title')}`;
            }
            case 'select': {
                return `${t('guide.normal.steps.teacher.2.title')}`;
            }
            default: {
                return ' ';
            }
        }
    };

    return (
        <div className={style.content}>
            <>
                <TeacherDatasetWrapper />
                {(activeView.active === 'userGrid' || activeView.active === 'userGridSimple') && (
                    <>
                        <h1>{title()}</h1>
                        <UserGrid />
                    </>
                )}
                {activeView.active === 'termChange' && (
                    <>
                        <h1>{title()}</h1>
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
