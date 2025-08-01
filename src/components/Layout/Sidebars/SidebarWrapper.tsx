import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from '../../../state/atom';
import Sidebar from './Sidebar';
import SidebarClosed from './SidebarClosed';
import { AnimatePresence, motion } from 'framer-motion';

const SidebarWrapper = () => {
    const user = useRecoilValue(userState);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 991.98);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    if (!user) return null;

    const modoSidebar = user.modo_side_bar;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={modoSidebar + isMobile}
                className={modoSidebar === 'Minimal' || (modoSidebar === 'Full' && isMobile)
                    ? 'sidebarclosed'
                    : 'sidebar'}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
            >
                {modoSidebar === 'Minimal' || (modoSidebar === 'Full' && isMobile)
                    ? <SidebarClosed />
                    : <Sidebar />}
            </motion.div>
        </AnimatePresence>
    );
};

export default SidebarWrapper;
