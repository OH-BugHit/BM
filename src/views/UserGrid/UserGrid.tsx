import { useTranslation } from 'react-i18next';
import style from './style.module.css';
import UserGridItem from './UserGridItem';
import Loading from '../../components/Loading/Loading';
import { useAtom, useAtomValue } from 'jotai';
import {
    currentCommonChallengeAtom,
    guidanceActiveAtom,
    profilePicturesAtom,
    settingAtom,
    takenUsernamesAtom,
    userGridOpenLabelAtom,
    usersAtom,
} from '../../atoms/state';
import ClassSelect from '../Scoreboard/ClassSelect/ClassSelect';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function UserGrid() {
    const { t } = useTranslation();
    const [users] = useAtom(usersAtom);
    const [allUNs] = useAtom(takenUsernamesAtom);
    const [profilePictures] = useAtom(profilePicturesAtom);
    const [currentTerm] = useAtom(currentCommonChallengeAtom);
    const [openResult, setOpenResult] = useAtom(userGridOpenLabelAtom); // For selecting term for calculting top players
    const [settings] = useAtom(settingAtom);
    const simpleMode = useAtomValue(guidanceActiveAtom);

    useEffect(() => {
        setOpenResult(currentTerm);
    }, [currentTerm, setOpenResult]);

    const maxWidth = `calc(${settings.userGridMaxColumns} * 220px + 4 * 1rem)`;

    const animateVariants = {
        enter: { width: '0%', opacity: 0.5 },
        center: { width: 'fit-content', opacity: 1 },
        exit: { width: '0%', opacity: 0.5 },
    };

    // TODO test rerendering and maybe limit?
    return (
        <>
            <div className={style.loadingWrapper}>
                {allUNs.length === 0 && (
                    <Loading
                        loading={true}
                        message={t('teacher.messages.waitingPeople')}
                    />
                )}
            </div>
            <div className={style.userGrid}>
                <AnimatePresence mode="wait">
                    {!simpleMode && (
                        <motion.div
                            key={'classSelect'}
                            variants={animateVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.25, ease: 'easeInOut', delay: 0.8 }}
                        >
                            <ClassSelect
                                openResult={openResult}
                                setOpenResult={setOpenResult}
                                blockOverall={true}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                <div
                    className={allUNs.length === 0 ? 'none' : style.userGridContainer}
                    style={{ maxWidth }}
                >
                    <div
                        className={style.grid}
                        data-testid="usergrid"
                    >
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
        </>
    );
}
