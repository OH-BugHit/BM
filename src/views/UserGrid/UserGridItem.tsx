import { useAtom, useAtomValue } from 'jotai';
import { CanvasCopy } from '../../components/CanvasCopy/CanvasCopy';
import style from './style.module.css';
import { MouseEvent } from 'react';
import { activityCacheAtom, selectedUserAtom } from '../../atoms/state';
import { useTranslation } from 'react-i18next';
import Crown from './Crown';

interface Props {
    username: string;
    alive: boolean;
    profilePicture: HTMLCanvasElement | null;
    openResult: string | null;
}

export default function UserGridItem({ username, alive, profilePicture, openResult }: Props) {
    const [selectedUser, setSelectedUser] = useAtom(selectedUserAtom);
    const { i18n } = useTranslation();
    const singleStudentActivityAtom = activityCacheAtom(username);
    const currentActivity = useAtomValue(singleStudentActivityAtom);

    const currentPic = currentActivity;
    const getPicture = () => {
        if (currentPic && !currentPic.hidden) {
            return (
                <CanvasCopy
                    sourceCanvas={currentPic.picture}
                    maxWidth={200}
                />
            );
        } else {
            if (i18n.language === 'fi-FI') {
                return (
                    <img
                        src="/noPic_FI.png"
                        width={200}
                    ></img>
                );
            } else {
                return (
                    <img
                        src="/noPic_EN.png"
                        width={200}
                    ></img>
                );
            }
        }
    };

    return (
        <button
            aria-pressed={selectedUser.username === username}
            className={style.gridItem}
            onClick={(e: MouseEvent) => {
                setSelectedUser((old) =>
                    old.username === username
                        ? { username: '', profilePicture: null }
                        : { username: username, profilePicture: profilePicture }
                );
                e.stopPropagation();
            }}
        >
            <Crown
                username={username}
                openResult={openResult}
            />
            <div className={style.userImageContainer}>{getPicture()}</div>
            <div
                className={
                    selectedUser.username === username ? style.selectedUserNameContainer : style.userNameContainer
                }
            >
                <div
                    className={style.colourBox}
                    style={alive ? { backgroundColor: 'lightgreen' } : { backgroundColor: 'lightcoral' }}
                />
                {username}
            </div>
        </button>
    );
}
