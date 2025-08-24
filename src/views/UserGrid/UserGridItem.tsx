import { useAtom } from 'jotai';
import { CanvasCopy } from '../../components/CanvasCopy/CanvasCopy';
import style from './style.module.css';
import { MouseEvent } from 'react';
import { selectedUserAtom, studentActivityAtom } from '../../atoms/state';

interface Props {
    username: string;
    alive: boolean;
    profilePicture: HTMLCanvasElement | null;
}

export default function UserGridItem({ username, alive, profilePicture }: Props) {
    const [selectedUser, setSelectedUser] = useAtom(selectedUserAtom);
    const [currentActivity] = useAtom(studentActivityAtom);

    const getPicture = () => {
        const currentPic = currentActivity.get(username);
        if (currentPic) {
            return (
                <CanvasCopy
                    sourceCanvas={currentPic}
                    maxWidth={200}
                />
            );
        } else {
            return (
                <img
                    src="/noPicture.png"
                    width={200}
                ></img>
            );
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
