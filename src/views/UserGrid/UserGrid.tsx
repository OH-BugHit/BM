import { useTranslation } from 'react-i18next';
import style from './style.module.css';
import UserGridItem from './UserGridItem';
import Loading from '../../components/Loading/Loading';
import { useAtom } from 'jotai';
import {
    currentCommonChallengeAtom,
    profilePicturesAtom,
    settingAtom,
    takenUsernamesAtom,
    usersAtom,
} from '../../atoms/state';
import ClassSelect from '../Scoreboard/ClassSelect/ClassSelect';
import { useEffect, useState } from 'react';

type UserGridProps = {
    simpleMode?: boolean;
};

export default function UserGrid({ simpleMode = false }: UserGridProps) {
    const { t } = useTranslation();
    const [users] = useAtom(usersAtom);
    const [allUNs] = useAtom(takenUsernamesAtom);
    const [profilePictures] = useAtom(profilePicturesAtom);
    const [currentTerm] = useAtom(currentCommonChallengeAtom);
    const [openResult, setOpenResult] = useState<string | null>(currentTerm); // For selecting term for calculting top players
    const [settings] = useAtom(settingAtom);

    useEffect(() => {
        setOpenResult(currentTerm);
    }, [currentTerm]);

    const maxWidth = `calc(${settings.userGridMaxColumns} * 220px + 4 * 1rem)`;

    // TODO test rerendering and maybe limit?
    return (
        <div className={style.userGrid}>
            {!simpleMode && (
                <ClassSelect
                    openResult={openResult}
                    setOpenResult={setOpenResult}
                    blockOverall={true}
                />
            )}

            <div
                className={allUNs.length === 0 ? 'none' : style.userGridContainer}
                style={{ maxWidth }}
            >
                <div
                    className={style.grid}
                    data-testid="usergrid"
                >
                    {allUNs.length === 0 && (
                        <Loading
                            loading={true}
                            message={t('teacher.messages.waitingPeople')}
                        />
                    )}
                    {allUNs
                        .filter((u) => users.some((user) => user.username === u.username))
                        .map((user) => {
                            return (
                                <UserGridItem
                                    key={user.username}
                                    username={user.username}
                                    alive={true}
                                    profilePicture={profilePictures.get(user.username) ?? null}
                                    openResult={openResult}
                                />
                            );
                        })}
                    {allUNs
                        .filter((u) => !users.some((user) => user.username === u.username))
                        .map((user) => {
                            return (
                                <UserGridItem
                                    key={user.username}
                                    username={user.username}
                                    alive={false}
                                    profilePicture={profilePictures.get(user.username) ?? null}
                                    openResult={openResult}
                                />
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
