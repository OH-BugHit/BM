import style from '../style.module.css';
import Guidance from '../../Guidance/Guidance';
import MenuPanel from '../../AppMenu/AppMenu';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtomValue } from 'jotai';
import { guidanceActiveAtom } from '../../../atoms/state';
import React from 'react';

const slideVariants = {
    enter: { x: '-100%' },
    center: { x: 0 },
    exit: { x: '-100%' },
};

function SideNavSwitcher() {
    const guidanceActive = useAtomValue(guidanceActiveAtom);
    return (
        <div className={style.sideNavWrapper}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={guidanceActive ? 'menu' : 'guidance'}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className={style.sideMenuWrapper}
                >
                    {guidanceActive ? (
                        <Guidance />
                    ) : (
                        <div className={style.menuPanelContainer}>
                            <MenuPanel />
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default React.memo(SideNavSwitcher);
