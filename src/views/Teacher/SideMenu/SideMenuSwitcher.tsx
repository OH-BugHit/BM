import style from '../style.module.css';
import Guidance from '../../Guidance/Guidance';
import MenuPanel from '../../AppMenu/AppMenu';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';
import { guidanceActiveAtom } from '../../../atoms/state';

const slideVariants = {
    enter: { x: '-100%' },
    center: { x: 0 },
    exit: { x: '-100%' },
};

export default function SideNavSwitcher() {
    console.log(`sideModule-module rerendered`);
    const [guidanceActive] = useAtom(guidanceActiveAtom);
    return (
        <div className={style.sideNavWrapper}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={guidanceActive ? 'menu' : 'guidance'}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
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
