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

    // Menu button for profile picture purposes, currently profile pictures are not supported
    return (
        <IconMenuItem
            tooltip={username}
            hideTip={open}
        >
            <MenuButton
                aria-label={'username'}
                size="large"
                variant="text"
                sx={{ fontSize: '1.1rem', color: 'whitesmoke' }}
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
