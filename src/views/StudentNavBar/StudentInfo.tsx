import { useAtom } from 'jotai';
import { MenuButton } from '../../components/Buttons/MenuButton';
import IconMenuItem from '../../components/IconMenu/Items';
import { profilePictureAtom, usernameAtom } from '../../atoms/state';

interface Props {
    open: boolean;
}
export default function StudentInfo({ open }: Props) {
    const [username] = useAtom(usernameAtom);
    const [profilePicture] = useAtom(profilePictureAtom);
    if (!open) return;

    return (
        <IconMenuItem
            tooltip={username}
            hideTip={open}
        >
            <MenuButton
                color="primary"
                aria-label={'username'}
                size="large"
                variant="text"
            >
                {profilePicture && (
                    <img
                        src={profilePicture}
                        height={'40'}
                        width={'40'}
                        style={{ borderRadius: '20px' }}
                    />
                )}
                {username}
            </MenuButton>
        </IconMenuItem>
    );
}
