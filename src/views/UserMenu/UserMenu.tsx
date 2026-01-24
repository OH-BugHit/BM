import FloatingMenu from '../../components/FloatingMenu/FloatingMenu';
import FloatingMenuItem from '../../components/FloatingMenu/FloatingMenuItem';
import { IconButton } from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useTranslation } from 'react-i18next';
import style from './style.module.css';
import { useAtomValue, useSetAtom } from 'jotai';
import {
    guidanceActiveAtom,
    messageTransferAtom,
    profilePicturesAtom,
    selectedUserAtom,
    takenUsernamesAtom,
    usersAtom,
} from '../../atoms/state';
import ResetScore from './ResetScore';
import ResetSelectedScore from './ResetSelectedScore';

export default function UserMenu() {
    const { t } = useTranslation();
    const selectedUser = useAtomValue(selectedUserAtom);
    const setKickUser = useSetAtom(messageTransferAtom);
    const setUsers = useSetAtom(usersAtom);
    const setAllUNs = useSetAtom(takenUsernamesAtom);
    const profilePictures = useAtomValue(profilePicturesAtom);
    const guided = useAtomValue(guidanceActiveAtom);

    return (
        <FloatingMenu
            title={t('dashboard.aria.socialUserMenu')}
            placement="relative"
            label={
                <div className={style.menuLogo}>
                    {selectedUser.username ? selectedUser.username : t('userGrid.titles.users')}
                </div>
            }
        >
            {selectedUser.username ? (
                <>
                    <FloatingMenuItem tooltip={t('userGrid.actions.deleteUser')}>
                        <IconButton
                            color="inherit"
                            onClick={() => {
                                setKickUser({
                                    message: t('userGrid.messages.remove'),
                                    reload: true,
                                    action: 'bouncer',
                                    recipient: { username: selectedUser.username },
                                });
                                setUsers((old) => old.filter((o) => o.username !== selectedUser.username));
                                setAllUNs((old) => old.filter((o) => o.username !== selectedUser.username));
                                profilePictures.delete(selectedUser.username);
                            }}
                            aria-label={t('userGrid.actions.deleteUser')}
                        >
                            <RemoveCircleIcon />
                        </IconButton>
                    </FloatingMenuItem>
                    <FloatingMenuItem tooltip={t('userGrid.actions.kickUser')}>
                        <IconButton
                            color="inherit"
                            onClick={() => {
                                setKickUser({
                                    message: t('userGrid.messages.kick'),
                                    reload: true,
                                    action: 'bouncer',
                                    recipient: { username: selectedUser.username },
                                });
                                setUsers((old) => old.filter((o) => o.username !== selectedUser.username));
                            }}
                            aria-label={t('userGrid.actions.kickUser')}
                        >
                            <PersonRemoveIcon />
                        </IconButton>
                    </FloatingMenuItem>
                    {guided ? (
                        <ResetScore selectedUser={selectedUser} />
                    ) : (
                        selectedUser && <ResetSelectedScore selectedUser={selectedUser} />
                    )}
                </>
            ) : (
                <p>{t('userGrid.actions.selectUser')}</p>
            )}
        </FloatingMenu>
    );
}
