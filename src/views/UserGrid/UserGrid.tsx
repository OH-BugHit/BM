import { useTranslation } from 'react-i18next';
import style from './style.module.css';
import UserGridItem from './UserGridItem';
import Loading from '../../components/Loading/Loading';
import { useAtom } from 'jotai';
import { profilePicturesAtom, takenUsernamesAtom, usersAtom } from '../../atoms/state';

export default function UserGrid() {
    const { t } = useTranslation();
    const [users] = useAtom(usersAtom);
    const [allUNs] = useAtom(takenUsernamesAtom);
    const [profilePictures] = useAtom(profilePicturesAtom);

    const COLS = 5;

    return (
        <div className={style.userGridContainer}>
            <div
                className={style.grid}
                style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
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
                            />
                        );
                    })}
            </div>
        </div>
    );
}
