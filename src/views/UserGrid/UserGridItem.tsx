import { useAtom } from 'jotai';
import { CanvasCopy } from '../../components/CanvasCopy/CanvasCopy';
import style from './style.module.css';
import { MouseEvent } from 'react';
import { selectedUserAtom } from '../../atoms/state';

interface Props {
    username: string;
    alive: boolean;
    profilePicture: HTMLCanvasElement | null;
}

export default function UserGridItem({ username, alive, profilePicture }: Props) {
    const [selectedUser, setSelectedUser] = useAtom(selectedUserAtom);
    return (
        <button
            tabIndex={0}
            data-testid={`user-grid-item-${username}`}
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
            <div className={style.userImageContainer}>
                {profilePicture && (
                    <CanvasCopy
                        sourceCanvas={profilePicture}
                        maxWidth={200}
                    />
                )}
            </div>
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
