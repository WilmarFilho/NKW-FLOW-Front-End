import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from '../../../state/atom';
import Sidebar from './Sidebar';
import SidebarClosed from './SidebarClosed';

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
       
            <div
                key={modoSidebar + isMobile}
                className={modoSidebar === 'Minimal' || (modoSidebar === 'Full' && isMobile)
                    ? 'sidebarclosed'
                    : 'sidebar'}
            >
                {modoSidebar === 'Minimal' || (modoSidebar === 'Full' && isMobile)
                    ? <SidebarClosed />
                    : <Sidebar />}
            </div>
    
    );
};

export default SidebarWrapper;
